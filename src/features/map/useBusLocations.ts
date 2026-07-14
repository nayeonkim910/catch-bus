import { useQuery } from '@tanstack/react-query';
import { busLocationsQueryOptions } from '../../lib/busQueries';

// 실제 차량 위치 API도 서버에서 15~30초 간격으로 갱신되므로 그보다 자주 당길 필요가 없다.
const POLL_INTERVAL_MS = 20 * 1000;

/**
 * 선택한 노선의 실시간 차량 위치를 20초마다 조회한다.
 * 탭이 백그라운드이면 폴링을 멈춰 불필요한 호출과 API 한도 낭비를 막는다.
 */
export function useBusLocations(routeId: string | null) {
  return useQuery({
    ...busLocationsQueryOptions(routeId ?? ''),
    enabled: routeId !== null,
    refetchInterval: routeId !== null ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });
}
