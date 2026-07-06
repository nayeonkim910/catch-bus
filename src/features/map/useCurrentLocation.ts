import { useEffect, useState } from 'react'

export type Coordinates = {
  latitude: number
  longitude: number
}

type LocationStatus = 'idle' | 'loading' | 'success' | 'error'

function getLocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return '위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해 주세요.'
  }

  return '현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

export function useCurrentLocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [status, setStatus] = useState<LocationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!errorMessage) return

    const timeoutId = window.setTimeout(() => setErrorMessage(null), 3_000)
    return () => window.clearTimeout(timeoutId)
  }, [errorMessage])

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus('error')
      setErrorMessage('현재 브라우저에서는 위치 기능을 사용할 수 없습니다.')
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    function requestPosition(enableHighAccuracy: boolean) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCoordinates({ latitude: coords.latitude, longitude: coords.longitude })
          setStatus('success')
        },
        (error) => {
          // GPS가 없는 데스크톱을 위해 정밀 위치 실패 시 일반 정확도로 한 번 재시도한다.
          if (enableHighAccuracy && error.code !== error.PERMISSION_DENIED) {
            requestPosition(false)
            return
          }

          setStatus('error')
          setErrorMessage(getLocationErrorMessage(error))
        },
        { enableHighAccuracy, timeout: 10_000, maximumAge: 0 },
      )
    }

    requestPosition(true)
  }

  return { coordinates, status, errorMessage, requestLocation }
}
