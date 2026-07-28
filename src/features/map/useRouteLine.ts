import { useQuery } from '@tanstack/react-query';
import { routeLineQueryOptions } from '@lib/busQueries';

/** 선택한 노선의 형상(폴리라인 좌표)을 조회한다. routeId가 없으면 비활성. */
export function useRouteLine(routeId: string | null) {
  return useQuery({
    ...routeLineQueryOptions(routeId ?? ''),
    enabled: routeId !== null,
  });
}
