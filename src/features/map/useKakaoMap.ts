import { useEffect, useRef, useState } from 'react'
import type { BusStation } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import type { Coordinates } from './useCurrentLocation'
import { loadKakaoMapsSdk } from './kakaoMapsSdk'

const INITIAL_MAP_LEVEL = 4
// 중심점 주변 조회 결과가 넓은 지도 전체를 대표하지 못하는 축척에서는 마커 조회를 중단한다.
const MAX_STATION_MARKER_LEVEL = 5
const MAP_IDLE_DELAY_MS = 500

type UseKakaoMapParams = {
  activeTab: MobileTab
  station: BusStation
}

export function useKakaoMap({ activeTab, station }: UseKakaoMapParams) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stationRef = useRef(station)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [mapLevel, setMapLevel] = useState(INITIAL_MAP_LEVEL)
  const [searchCenter, setSearchCenter] = useState<Coordinates | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    stationRef.current = station
  }, [station])

  useEffect(() => {
    let isCancelled = false

    async function initializeMap() {
      try {
        const maps = await loadKakaoMapsSdk()
        if (isCancelled || !containerRef.current) return

        const initialStation = stationRef.current
        const center = new maps.LatLng(initialStation.latitude, initialStation.longitude)
        const nextMap = new maps.Map(containerRef.current, {
          center,
          level: INITIAL_MAP_LEVEL,
        })

        setMap(nextMap)
        setSearchCenter({
          latitude: initialStation.latitude,
          longitude: initialStation.longitude,
        })
      } catch (error) {
        if (isCancelled) return

        console.error('카카오맵 초기화 실패:', error)
        setErrorMessage('지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      }
    }

    void initializeMap()
    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!map) return
    map.setCenter(new kakao.maps.LatLng(station.latitude, station.longitude))
  }, [map, station.latitude, station.longitude])

  useEffect(() => {
    if (!map) return

    const activeMap = map
    let timeoutId: number | null = null

    function updateVisibleArea() {
      if (timeoutId !== null) window.clearTimeout(timeoutId)

      // 지도 이동 중 연속 요청을 막고, 이동이 끝난 뒤의 중심만 조회한다.
      timeoutId = window.setTimeout(() => {
        const center = activeMap.getCenter()
        const level = activeMap.getLevel()

        setMapLevel(level)
        if (level <= MAX_STATION_MARKER_LEVEL) {
          setSearchCenter({ latitude: center.getLat(), longitude: center.getLng() })
        }
      }, MAP_IDLE_DELAY_MS)
    }

    kakao.maps.event.addListener(activeMap, 'idle', updateVisibleArea)
    return () => {
      kakao.maps.event.removeListener(activeMap, 'idle', updateVisibleArea)
      if (timeoutId !== null) window.clearTimeout(timeoutId)
    }
  }, [map])

  useEffect(() => {
    if (activeTab !== 'map' || !map) return

    // display:none 상태였던 모바일 탭은 표시 후 지도 크기를 다시 계산해야 한다.
    map.relayout()
  }, [activeTab, map])

  return {
    containerRef,
    map,
    errorMessage,
    searchCenter,
    canShowStations: mapLevel <= MAX_STATION_MARKER_LEVEL,
  }
}
