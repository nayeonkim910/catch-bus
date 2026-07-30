import type { RouteStation } from '@shared/types/bus';

// 노선 경유 정류장 목록에서 대상 정류장을 찾는다. 순환·왕복 노선은 같은 정류장이
// 두 번 나올 수 있어 id+순번 일치를 우선하고, 순번 → id 순으로 폴백한다.
export function findTargetStationIndex(
  stations: RouteStation[],
  targetStationId: string,
  targetStationOrder: number,
) {
  const exactIndex = stations.findIndex(
    (station) => station.id === targetStationId && station.sequence === targetStationOrder,
  );

  if (exactIndex >= 0) return exactIndex;

  const sequenceIndex = stations.findIndex((station) => station.sequence === targetStationOrder);
  return sequenceIndex >= 0
    ? sequenceIndex
    : stations.findIndex((station) => station.id === targetStationId);
}
