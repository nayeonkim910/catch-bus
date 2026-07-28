import { useEffect } from 'react';
import type { RouteLinePoint } from '@shared/types/bus';

/**
 * 선택한 노선의 형상을 지도에 폴리라인으로 그린다.
 * 흰 케이싱 위에 노선색 본선을 얹어 배경 지도 위에서도 선이 또렷하게 보이게 한다.
 */
export function useRoutePolyline(
  map: kakao.maps.Map | null,
  points: RouteLinePoint[] | undefined,
  accentColor: string,
) {
  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const path = points.map((point) => new kakao.maps.LatLng(point.latitude, point.longitude));
    const casing = new kakao.maps.Polyline({
      path,
      strokeWeight: 8,
      strokeColor: '#FFFFFF',
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
    });
    const line = new kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: accentColor,
      strokeOpacity: 0.95,
      strokeStyle: 'solid',
    });

    casing.setMap(map);
    line.setMap(map);

    return () => {
      casing.setMap(null);
      line.setMap(null);
    };
  }, [map, points, accentColor]);
}
