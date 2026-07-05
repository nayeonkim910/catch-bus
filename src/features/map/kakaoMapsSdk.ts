const KAKAO_MAP_SCRIPT_ID = 'kakao-maps-sdk'
const KAKAO_MAP_SCRIPT_URL = 'https://dapi.kakao.com/v2/maps/sdk.js'
const SDK_LOAD_TIMEOUT_MS = 10_000

// 여러 컴포넌트가 동시에 요청해도 SDK는 한 번만 로드한다.
let sdkPromise: Promise<typeof kakao.maps> | null = null

function getScriptUrl() {
  const key = import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY?.trim()

  if (!key) {
    throw new Error('카카오맵 JavaScript 키가 설정되지 않았습니다.')
  }

  const url = new URL(KAKAO_MAP_SCRIPT_URL)
  url.searchParams.set('appkey', key)
  // 스크립트 로드 후 필요한 시점에 kakao.maps.load로 초기화한다.
  url.searchParams.set('autoload', 'false')
  return url.toString()
}

function isSdkAvailable() {
  return typeof kakao !== 'undefined' && typeof kakao.maps?.load === 'function'
}

function loadScript() {
  const scriptUrl = getScriptUrl()

  return new Promise<void>((resolve, reject) => {
    // 이전 시도의 스크립트가 남아 있으면 제거해 재시도를 가능하게 한다.
    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID)

    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    const timeoutId = window.setTimeout(() => {
      cleanup()
      script.remove()
      reject(new Error('카카오맵 SDK 로딩 시간이 초과되었습니다.'))
    }, SDK_LOAD_TIMEOUT_MS)

    function cleanup() {
      window.clearTimeout(timeoutId)
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }

    function handleLoad() {
      cleanup()
      resolve()
    }

    function handleError() {
      cleanup()
      script.remove()
      reject(new Error('카카오맵 SDK를 불러오지 못했습니다.'))
    }

    script.id = KAKAO_MAP_SCRIPT_ID
    script.src = scriptUrl
    script.async = true
    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)
    document.head.append(script)
  })
}

function initializeSdk() {
  return new Promise<typeof kakao.maps>((resolve, reject) => {
    if (!isSdkAvailable()) {
      reject(new Error('카카오맵 SDK를 초기화하지 못했습니다.'))
      return
    }

    const timeoutId = window.setTimeout(() => {
      reject(new Error('카카오맵 SDK 초기화 시간이 초과되었습니다.'))
    }, SDK_LOAD_TIMEOUT_MS)

    try {
      kakao.maps.load(() => {
        window.clearTimeout(timeoutId)
        resolve(kakao.maps)
      })
    } catch {
      window.clearTimeout(timeoutId)
      reject(new Error('카카오맵 SDK를 초기화하지 못했습니다.'))
    }
  })
}

async function createSdkPromise() {
  if (!isSdkAvailable()) {
    await loadScript()
  }

  return initializeSdk()
}

export function loadKakaoMapsSdk() {
  sdkPromise ??= createSdkPromise().catch((error) => {
    // 실패한 Promise를 캐시하지 않아 다음 호출에서 다시 시도할 수 있다.
    sdkPromise = null
    throw error
  })

  return sdkPromise
}
