import { queryOptions } from '@tanstack/react-query';
import { getStationArrivals } from './busApi';

// 도착정보는 실시간성이 중요하므로 짧게 잡아 자주 갱신될 수 있게 한다.
const STATION_ARRIVALS_STALE_TIME_MS = 30 * 1000;

/**
 * 정류장 도착정보 조회를 위한 재사용 가능한 TanStack Query 옵션.
 *
 * 같은 `stationId`에 대한 조회는 동일한 queryKey를 공유하므로,
 * 여러 컴포넌트(선택 정류장 상세, 즐겨찾기 카드 등)가 정류장을 겹쳐 참조해도
 * 실제 네트워크 요청은 정류장당 한 번만 발생한다.
 */
export function stationArrivalsQueryOptions(stationId: string) {
  return queryOptions({
    queryKey: ['station-arrivals', stationId],
    queryFn: ({ signal }) => getStationArrivals(stationId, signal),
    staleTime: STATION_ARRIVALS_STALE_TIME_MS,
    select: (response) => response.data.arrivals,
  });
}
