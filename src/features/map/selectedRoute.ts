import type { BusArrival } from '@shared/types/bus';

/**
 * 지도에 시각화할 "선택 노선". 어떤 정류장(targetStation) 맥락에서 골랐는지 함께 담아,
 * 방면 라벨과 진행 방향 판정의 기준으로 쓴다.
 */
export type SelectedRoute = {
  routeId: string;
  routeName: string;
  routeTypeCode: number;
  destinationName: string;
  targetStationId: string;
  targetStationOrder: number;
};

export function createSelectedRoute(arrival: BusArrival): SelectedRoute {
  return {
    routeId: arrival.routeId,
    routeName: arrival.routeName,
    routeTypeCode: arrival.routeTypeCode,
    destinationName: arrival.destinationName,
    targetStationId: arrival.stationId,
    targetStationOrder: arrival.stationOrder,
  };
}
