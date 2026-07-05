import { useCallback, useEffect, useRef, useState } from 'react'
import { searchStations } from '../../lib/busApi'
import type { BusStation } from '../../shared/types/bus'

export type StationSearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; stations: BusStation[] }
  | { status: 'error'; message: string }

type CacheEntry = {
  expiresAt: number
  stations: BusStation[]
}

const CACHE_DURATION_MS = 5 * 60 * 1000
const stationCache = new Map<string, CacheEntry>()

function getCacheKey(query: string) {
  return query.trim().toLocaleLowerCase('ko-KR')
}

function getCachedStations(query: string) {
  const cacheKey = getCacheKey(query)
  const cached = stationCache.get(cacheKey)

  if (!cached) return null

  if (cached.expiresAt <= Date.now()) {
    stationCache.delete(cacheKey)
    return null
  }

  return cached.stations
}

function cacheStations(query: string, stations: BusStation[]) {
  stationCache.set(getCacheKey(query), {
    expiresAt: Date.now() + CACHE_DURATION_MS,
    stations,
  })
}

export function useStationSearch() {
  const [query, setQueryState] = useState('')
  const [searchState, setSearchState] = useState<StationSearchState>({ status: 'idle' })
  const requestRef = useRef<AbortController | null>(null)

  const cancelRequest = useCallback(() => {
    requestRef.current?.abort()
    requestRef.current = null
  }, [])

  const resetResults = useCallback(() => {
    cancelRequest()
    setSearchState({ status: 'idle' })
  }, [cancelRequest])

  const setQuery = useCallback((nextQuery: string) => {
    cancelRequest()
    setQueryState(nextQuery)
    setSearchState({ status: 'idle' })
  }, [cancelRequest])

  const submitSearch = useCallback(async () => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSearchState({ status: 'error', message: '검색어를 입력해 주세요.' })
      return
    }

    const cachedStations = getCachedStations(trimmedQuery)
    if (cachedStations) {
      setSearchState({ status: 'success', stations: cachedStations })
      return
    }

    cancelRequest()
    const controller = new AbortController()
    requestRef.current = controller
    setSearchState({ status: 'loading' })

    try {
      const result = await searchStations(trimmedQuery, controller.signal)

      if (controller.signal.aborted) return

      cacheStations(trimmedQuery, result.data.stations)
      setSearchState({ status: 'success', stations: result.data.stations })
    } catch {
      if (controller.signal.aborted) return

      setSearchState({
        status: 'error',
        message: '정류장을 검색하지 못했어요. 잠시 후 다시 시도해 주세요.',
      })
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
      }
    }
  }, [cancelRequest, query])

  useEffect(() => cancelRequest, [cancelRequest])

  return {
    query,
    searchState,
    setQuery,
    submitSearch,
    resetResults,
  }
}
