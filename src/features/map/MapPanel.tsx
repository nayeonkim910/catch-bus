import { useMemo } from 'react';
import type { BusStation } from '@shared/types/bus';
import { Button } from '@shared/components/ui/Button';
import { getRouteTheme } from '@shared/utils/routeTheme';
import { RouteOverlayPanel } from './RouteOverlayPanel';
import type { SelectedRoute } from './selectedRoute';
import { useBusLocations } from './useBusLocations';
import { useBusMarkers } from './useBusMarkers';
import { useCurrentLocation } from './useCurrentLocation';
import { useKakaoMap } from './useKakaoMap';
import { useCurrentLocationMarker, useStationMarkers } from './useMapMarkers';
import { useNearbyStations } from './useNearbyStations';
import { useRouteLine } from './useRouteLine';
import { useRoutePolyline } from './useRoutePolyline';
import { useRouteStations } from './useRouteStations';

type MapPanelProps = {
  station: BusStation | null;
  selectedRoute: SelectedRoute | null;
  onStationSelect: (station: BusStation) => void;
  onClearRoute: () => void;
};

export function MapPanel({ station, selectedRoute, onStationSelect, onClearRoute }: MapPanelProps) {
  const location = useCurrentLocation();
  const {
    containerRef,
    map,
    errorMessage: mapError,
    searchCenter,
    canShowStations,
  } = useKakaoMap({ station });
  const nearbyStations = useNearbyStations(canShowStations ? searchCenter : null);
  const visibleStations = useMemo(() => {
    const stations = canShowStations ? (nearbyStations.data ?? []) : [];

    // 주변 조회가 로딩·실패 상태여도 사용자가 선택한 정류장은 지도에 유지한다.
    if (!station) return stations;

    return stations.some((nearbyStation) => nearbyStation.id === station.id)
      ? stations
      : [...stations, station];
  }, [canShowStations, nearbyStations.data, station]);

  const routeId = selectedRoute?.routeId ?? null;
  const routeLine = useRouteLine(routeId);
  const routeStations = useRouteStations(routeId);
  const busLocations = useBusLocations(routeId);

  // 차량은 좌표 없이 정류장 순번만 주므로, stationId로 경유 정류장 좌표를 찾는 조회 맵을 만든다.
  const stationsById = useMemo(() => {
    if (!routeStations.data) return null;
    return new Map(routeStations.data.map((routeStation) => [routeStation.id, routeStation]));
  }, [routeStations.data]);

  const routeAccentColor = selectedRoute
    ? getRouteTheme(selectedRoute.routeTypeCode).accentColor
    : '#2563EB';

  useCurrentLocationMarker(map, location.coordinates);
  // 정류장 마커는 항상 유지되고, 아래 노선 오버레이(선·차량)만 선택에 따라 얹혔다 사라진다.
  useStationMarkers({
    map,
    stations: visibleStations,
    selectedStationId: station?.id ?? null,
    onStationSelect,
  });
  useRoutePolyline(map, routeLine.data, routeAccentColor);
  useBusMarkers({
    map,
    buses: busLocations.data,
    stationsById,
    routeName: selectedRoute?.routeName ?? '',
  });

  const nearbyError = nearbyStations.isError ? '근처 정류장을 불러오지 못했습니다.' : null;

  return (
    <main className="relative h-full min-h-0 min-w-0 overflow-hidden bg-slate-100" id="panel-map">
      <div ref={containerRef} className="h-full w-full" aria-label="버스 정류장 지도" />

      {/* 데스크톱은 상단 중앙을 검색바가 쓰므로, 노선 오버레이를 좌측 패널 너머 지도 하단으로 뺀다. */}
      {selectedRoute && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 lg:top-auto lg:bottom-4 lg:left-[calc(var(--details-panel)+2rem)]">
          <RouteOverlayPanel
            route={selectedRoute}
            busCount={busLocations.data?.length ?? 0}
            isLoading={busLocations.isLoading}
            isError={busLocations.isError}
            onClear={onClearRoute}
          />
        </div>
      )}

      <div className="absolute right-4 bottom-4 z-10 flex max-w-72 flex-col-reverse items-end gap-2">
        <Button
          variant="secondary"
          className="bg-card shadow-md"
          onClick={location.requestLocation}
          disabled={location.status === 'loading'}
        >
          {location.status === 'loading' ? '위치 확인 중…' : '내 위치에서 찾기'}
        </Button>

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
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-600"
          role="alert"
        >
          {mapError}
        </div>
      )}
    </main>
  );
}
