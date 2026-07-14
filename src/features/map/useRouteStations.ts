import { useQuery } from '@tanstack/react-query';
import { routeStationsQueryOptions } from '../../lib/busQueries';

/**
 * 선택한 노선의 경유 정류장을 조회한다(지도 좌표 조인용).
 * useRouteStationData와 같은 queryKey를 공유하므로 네트워크 요청은 노선당 한 번이다.
 */
export function useRouteStations(routeId: string | null) {
  return useQuery({
    ...routeStationsQueryOptions(routeId ?? ''),
    enabled: routeId !== null,
    select: (response) => response.data.stations,
  });
}
