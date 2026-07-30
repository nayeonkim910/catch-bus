import { useQuery } from '@tanstack/react-query';
import { routeStationsQueryOptions } from '@lib/busQueries';
import type { RouteStation } from '@shared/types/bus';
import { findTargetStationIndex } from './routeStationTarget';

const TIMELINE_STATION_COUNT = 5;

function createTimeline(
  stations: RouteStation[],
  targetStationId: string,
  targetStationOrder: number,
) {
  const targetIndex = findTargetStationIndex(stations, targetStationId, targetStationOrder);
  if (targetIndex < 0) return null;

  const visibleStations = stations.slice(
    Math.max(0, targetIndex - TIMELINE_STATION_COUNT + 1),
    targetIndex + 1,
  );
  const emptySlots = Array<string | null>(TIMELINE_STATION_COUNT - visibleStations.length).fill(
    null,
  );

  // 목표 정류장은 항상 오른쪽 끝에 오도록 앞쪽이 부족한 노선만 빈 칸으로 채운다.
  return [...emptySlots, ...visibleStations.map((station) => station.name)];
}

export function useRouteStationData(
  routeId: string,
  targetStationId: string,
  targetStationOrder: number,
  enabled: boolean,
) {
  return useQuery({
    ...routeStationsQueryOptions(routeId),
    enabled,
    select: (response) => ({
      stations: response.data.stations,
      timeline: createTimeline(response.data.stations, targetStationId, targetStationOrder),
    }),
  });
}
