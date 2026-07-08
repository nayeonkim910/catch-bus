import { useMemo } from 'react'
import type { BusStation } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { useCurrentLocation } from './useCurrentLocation'
import { useKakaoMap } from './useKakaoMap'
import { useCurrentLocationMarker, useStationMarkers } from './useMapMarkers'
import { useNearbyStations } from './useNearbyStations'

type MapPanelProps = {
  activeTab: MobileTab
  station: BusStation | null
  onStationSelect: (station: BusStation) => void
}

export function MapPanel({ activeTab, station, onStationSelect }: MapPanelProps) {
  const location = useCurrentLocation()
  const {
    containerRef,
    map,
    errorMessage: mapError,
    searchCenter,
    canShowStations,
  } = useKakaoMap({ activeTab, station })
  const nearbyStations = useNearbyStations(
    canShowStations ? searchCenter : null,
  )
  const visibleStations = useMemo(() => {
    const stations = canShowStations ? (nearbyStations.data ?? []) : []

    // 주변 조회가 로딩·실패 상태여도 사용자가 선택한 정류장은 지도에 유지한다.
    if (!station) return stations

    return stations.some((nearbyStation) => nearbyStation.id === station.id)
      ? stations
      : [...stations, station]
  }, [canShowStations, nearbyStations.data, station])

  useCurrentLocationMarker(map, location.coordinates)
  useStationMarkers({
    map,
    stations: visibleStations,
    selectedStationId: station?.id ?? null,
    onStationSelect,
  })

  const nearbyError = nearbyStations.isError
    ? '근처 정류장을 불러오지 못했습니다.'
    : null

  return (
    <main
      className={`${activeTab === 'map' ? 'block' : 'hidden'} relative h-full min-h-0 min-w-0 overflow-hidden bg-slate-100 lg:block`}
      id="panel-map"
      role="tabpanel"
    >
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="버스 정류장 지도"
      />

      <div className="absolute right-4 top-4 z-10 flex max-w-72 flex-col items-end gap-2 lg:top-20">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:cursor-wait disabled:text-slate-400"
          onClick={location.requestLocation}
          disabled={location.status === 'loading'}
        >
          {location.status === 'loading' ? '위치 확인 중…' : '내 위치에서 찾기'}
        </button>

        {(location.errorMessage || nearbyError) && (
          <p className="rounded-lg bg-white px-3 py-2 text-xs text-red-600 shadow" role="alert">
            {location.errorMessage ?? nearbyError}
          </p>
        )}

        {nearbyStations.isFetching && (
          <p className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600 shadow" role="status">
            근처 정류장을 찾고 있습니다.
          </p>
        )}

        {!canShowStations && (
          <p className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600 shadow" role="status">
            지도를 확대하면 정류장이 표시됩니다.
          </p>
        )}
      </div>

      {mapError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-600" role="alert">
          {mapError}
        </div>
      )}
    </main>
  )
}
