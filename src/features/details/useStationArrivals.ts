import { useQuery } from '@tanstack/react-query';
import { stationArrivalsQueryOptions } from '@lib/busQueries';

// 도착정보는 서버에서도 30초 간격 안팎으로 갱신되므로 그보다 자주 당길 필요가 없다.
const POLL_INTERVAL_MS = 30 * 1000;

/**
 * 선택한 정류장의 도착정보를 30초마다 조회한다.
 *
 * 즐겨찾기(useFavoriteArrivals)와 같은 `stationArrivalsQueryOptions`를 사용하므로
 * queryKey가 같아 정류장을 겹쳐 참조해도 네트워크 요청은 정류장당 한 번만 발생한다.
 * 탭이 백그라운드이면 폴링을 멈춰 불필요한 호출과 API 한도 낭비를 막는다.
 */
export function useStationArrivals(stationId: string | null) {
  return useQuery({
    ...stationArrivalsQueryOptions(stationId ?? ''),
    enabled: stationId !== null,
    refetchInterval: stationId !== null ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });
}
