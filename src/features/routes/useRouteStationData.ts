import { useQuery } from '@tanstack/react-query'
import { getRouteStations } from '../../lib/busApi'
import type { RouteStation } from '../../shared/types/bus'

const TIMELINE_STATION_COUNT = 5
const ROUTE_CACHE_DURATION_MS = 24 * 60 * 60 * 1000

function findTargetIndex(
  stations: RouteStation[],
  targetStationId: string,
  targetStationOrder: number,
) {
  const exactIndex = stations.findIndex(
    (station) =>
      station.id === targetStationId && station.sequence === targetStationOrder,
  )

  if (exactIndex >= 0) return exactIndex

  const sequenceIndex = stations.findIndex(
    (station) => station.sequence === targetStationOrder,
  )
  return sequenceIndex >= 0
    ? sequenceIndex
    : stations.findIndex((station) => station.id === targetStationId)
}

function createTimeline(
  stations: RouteStation[],
  targetStationId: string,
  targetStationOrder: number,
) {
  const targetIndex = findTargetIndex(
    stations,
    targetStationId,
    targetStationOrder,
  )
  if (targetIndex < 0) return null

  const visibleStations = stations.slice(
    Math.max(0, targetIndex - TIMELINE_STATION_COUNT + 1),
    targetIndex + 1,
  )
  const emptySlots = Array<string | null>(
    TIMELINE_STATION_COUNT - visibleStations.length,
  ).fill(null)

  // 목표 정류장은 항상 오른쪽 끝에 오도록 앞쪽이 부족한 노선만 빈 칸으로 채운다.
  return [...emptySlots, ...visibleStations.map((station) => station.name)]
}

export function useRouteStationData(
  routeId: string,
  targetStationId: string,
  targetStationOrder: number,
) {
  return useQuery({
    queryKey: ['route-stations', routeId],
    queryFn: ({ signal }) => getRouteStations(routeId, signal),
    staleTime: ROUTE_CACHE_DURATION_MS,
    gcTime: ROUTE_CACHE_DURATION_MS,
    select: (response) => ({
      stations: response.data.stations,
      timeline: createTimeline(
        response.data.stations,
        targetStationId,
        targetStationOrder,
      ),
    }),
  })
}
