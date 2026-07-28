import { queryOptions } from '@tanstack/react-query';
import {
  getBusLocations,
  getRouteLine,
  getRouteStations,
  getStationArrivals,
  searchStations,
} from './busApi';

// 도착정보는 실시간성이 중요하므로 짧게 잡아 자주 갱신될 수 있게 한다.
const STATION_ARRIVALS_STALE_TIME_MS = 30 * 1000;
// 노선 형상·경유 정류장은 거의 바뀌지 않으므로 길게 캐시한다.
const ROUTE_STATIC_STALE_TIME_MS = 24 * 60 * 60 * 1000;
// 실시간 차량 위치는 자주 바뀌므로 짧게 잡는다.
const BUS_LOCATIONS_STALE_TIME_MS = 10 * 1000;
// 같은 검색어 결과는 자주 바뀌지 않으므로 5분간 캐시한다.
const STATION_SEARCH_STALE_TIME_MS = 5 * 60 * 1000;

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

/**
 * 노선 경유 정류장 조회용 base 옵션(select 없음).
 *
 * 진행선(useRouteStationData)과 지도 좌표 조회(useRouteStations)가 같은 queryKey를
 * 공유해 조회를 한 번만 수행하도록, 공통 옵션만 여기서 정의하고 select는 각 소비자가 붙인다.
 */
export function routeStationsQueryOptions(routeId: string) {
  return queryOptions({
    queryKey: ['route-stations', routeId],
    queryFn: ({ signal }) => getRouteStations(routeId, signal),
    staleTime: ROUTE_STATIC_STALE_TIME_MS,
    gcTime: ROUTE_STATIC_STALE_TIME_MS,
  });
}

/** 노선 형상(폴리라인 좌표) 조회용 옵션. */
export function routeLineQueryOptions(routeId: string) {
  return queryOptions({
    queryKey: ['route-line', routeId],
    queryFn: ({ signal }) => getRouteLine(routeId, signal),
    staleTime: ROUTE_STATIC_STALE_TIME_MS,
    gcTime: ROUTE_STATIC_STALE_TIME_MS,
    select: (response) => response.data.points,
  });
}

/**
 * 실시간 차량 위치 조회용 옵션.
 *
 * retry는 앱 기본값(QueryProvider의 retry: 1)을 그대로 상속한다. 8초 타임아웃이 붙은 뒤로
 * 재시도 1회당 대기가 커졌고, 이 쿼리는 20초 폴링(useBusLocations)이 뒤를 받쳐 연속 실패도
 * 다음 주기에 재시도되므로, 단발 복구만 노리는 기본값 1로 충분하다.
 */
export function busLocationsQueryOptions(routeId: string) {
  return queryOptions({
    queryKey: ['bus-locations', routeId],
    queryFn: ({ signal }) => getBusLocations(routeId, signal),
    staleTime: BUS_LOCATIONS_STALE_TIME_MS,
    select: (response) => response.data.locations,
  });
}

/**
 * 정류장 이름 검색 조회용 옵션.
 *
 * 제출된 검색어를 queryKey로 삼아, 같은 검색어를 다시 검색하면 캐시를 재사용한다.
 */
export function searchStationsQueryOptions(query: string) {
  return queryOptions({
    queryKey: ['station-search', query],
    queryFn: ({ signal }) => searchStations(query, signal),
    staleTime: STATION_SEARCH_STALE_TIME_MS,
    select: (response) => response.data.stations,
  });
}
