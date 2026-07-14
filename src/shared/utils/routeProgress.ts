export const ROUTE_PROGRESS_STATION_COUNT = 5;

const FIRST_STATION_POSITION = 6;
const LAST_STATION_POSITION = 94;
const STATION_GAP =
  (LAST_STATION_POSITION - FIRST_STATION_POSITION) / (ROUTE_PROGRESS_STATION_COUNT - 1);

// 라벨 사이에 여백을 남기면서 각 정류장 이름이 사용할 수 있는 폭이다.
export const ROUTE_PROGRESS_LABEL_WIDTH = STATION_GAP - 4;

export const ROUTE_PROGRESS_STATION_POSITIONS = Array.from(
  { length: ROUTE_PROGRESS_STATION_COUNT },
  (_, index) => FIRST_STATION_POSITION + STATION_GAP * index,
);

type RouteProgressModelOptions = {
  currentStationName: string | null;
  destinationStationName: string;
  remainingStops: number | null;
  stationNames?: (string | null)[] | null;
};

export function getRouteProgressLayout(remainingStops: number | null) {
  if (remainingStops === null) {
    return { busPosition: null, busStationIndex: null, traveledWidth: 0 };
  }

  // 화면에 표시한 정류장 범위 밖의 버스는 임의의 위치에 붙이지 않는다.
  if (remainingStops >= ROUTE_PROGRESS_STATION_COUNT) {
    return { busPosition: null, busStationIndex: null, traveledWidth: 0 };
  }

  const busPosition = LAST_STATION_POSITION - Math.max(remainingStops, 0) * STATION_GAP;
  const busStationIndex =
    remainingStops >= 0 && remainingStops < ROUTE_PROGRESS_STATION_COUNT
      ? ROUTE_PROGRESS_STATION_COUNT - 1 - remainingStops
      : null;

  return {
    busPosition,
    busStationIndex,
    traveledWidth: Math.max(busPosition - FIRST_STATION_POSITION, 0),
  };
}

export function getRouteProgressModel({
  currentStationName,
  destinationStationName,
  remainingStops,
  stationNames,
}: RouteProgressModelOptions) {
  const layout = getRouteProgressLayout(remainingStops);
  const hasStationTimeline = Boolean(stationNames);
  const currentStationFallback =
    layout.busPosition !== null && currentStationName && !hasStationTimeline && remainingStops !== 0
      ? {
          name: currentStationName,
          position: layout.busPosition,
          alignLeft: layout.busPosition === 0,
        }
      : null;

  return {
    ...layout,
    accessibleLabel:
      remainingStops === null
        ? `버스 위치 정보 없음, 목적지 ${destinationStationName}`
        : `버스는 ${currentStationName ?? '현재 위치'}에 있으며 ${destinationStationName}까지 ${remainingStops}정거장 남음`,
    nodes: ROUTE_PROGRESS_STATION_POSITIONS.map((position, index) => ({
      index,
      position,
      name: stationNames?.[index] ?? null,
      isTarget: index === ROUTE_PROGRESS_STATION_COUNT - 1,
      isCurrent: layout.busStationIndex === index,
      isPassed: layout.busPosition !== null && position <= layout.busPosition,
    })),
    currentStationFallback,
    destinationStationFallback: hasStationTimeline ? null : destinationStationName,
    hasVehicleLocation: remainingStops !== null,
  };
}
