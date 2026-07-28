import { useEffect } from 'react';
import type { RouteStation, VehicleLocation } from '@shared/types/bus';
import { getCrowdedness } from '@shared/utils/crowdedness';
import { getRouteTheme } from '@shared/utils/routeTheme';
import { createBusVehicleMarker } from './busVehicleMarker';

type UseBusMarkersParams = {
  map: kakao.maps.Map | null;
  buses: VehicleLocation[] | undefined;
  /** stationId → 경유 정류장(좌표). 차량은 좌표가 없고 정류장 순번만 주므로 여기서 좌표를 얻는다. */
  stationsById: Map<string, RouteStation> | null;
  routeName: string;
};

/**
 * 실시간 차량 위치를 지도 마커로 표시한다.
 * bus-locations는 좌표를 주지 않으므로 stationId로 경유 정류장 좌표에 스냅한다.
 * 좌표를 찾지 못한 차량은 잘못된 위치를 노출하지 않도록 건너뛴다.
 */
export function useBusMarkers({ map, buses, stationsById, routeName }: UseBusMarkersParams) {
  useEffect(() => {
    if (!map || !buses || !stationsById) return;

    const overlays = buses
      .map((bus) => {
        const station = stationsById.get(bus.stationId);
        if (!station) return null;

        const theme = getRouteTheme(bus.routeTypeCode);
        const crowd = getCrowdedness(bus.crowdedCode);
        const label = [
          `${routeName}번 버스`,
          `${station.name} 부근`,
          crowd ? `혼잡도 ${crowd.label}` : null,
          bus.isLowFloor ? '저상버스' : null,
        ]
          .filter(Boolean)
          .join(', ');

        const element = createBusVehicleMarker({
          label,
          accentColor: theme.accentColor,
          dotColor: crowd?.dotColor ?? null,
        });
        const overlay = new kakao.maps.CustomOverlay({
          position: new kakao.maps.LatLng(station.latitude, station.longitude),
          content: element,
          xAnchor: 0.5,
          yAnchor: 0.5,
          zIndex: 5,
        });

        overlay.setMap(map);
        return overlay;
      })
      .filter((overlay): overlay is kakao.maps.CustomOverlay => overlay !== null);

    return () => overlays.forEach((overlay) => overlay.setMap(null));
  }, [map, buses, stationsById, routeName]);
}
