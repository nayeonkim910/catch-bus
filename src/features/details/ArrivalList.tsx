import { useMemo } from 'react';
import type { BusArrival, BusStation } from '@shared/types/bus';
import { useSelectionStore } from '@features/selection/selectionStore';
import { ArrivalCard } from './ArrivalCard';

type ArrivalListProps = {
  station: BusStation;
  arrivals: BusArrival[];
};
// 임박순 정렬 키. 도착 예정이 없는 노선(운행 종료·정보 없음)은 맨 아래로 이동.
function arrivalRank(arrival: BusArrival) {
  return arrival.first?.arrivalSeconds ?? Number.POSITIVE_INFINITY;
}

export function ArrivalList({ station, arrivals }: ArrivalListProps) {
  const selectedRouteId = useSelectionStore((state) => state.selectedRoute?.routeId ?? null);
  const selectRoute = useSelectionStore((state) => state.selectRoute);

  // arrivals 데이터가 갱신될 때만 다시 정렬
  const sortedArrivals = useMemo(
    () =>
      [...arrivals].sort(
        (a, b) =>
          arrivalRank(a) - arrivalRank(b) ||
          a.routeName.localeCompare(b.routeName, 'ko', { numeric: true }),
      ),
    [arrivals],
  );
  return (
    <div className="space-y-3">
      {sortedArrivals.map((arrival) => (
        <ArrivalCard
          key={arrival.routeId}
          station={station}
          arrival={arrival}
          isRouteSelected={arrival.routeId === selectedRouteId}
          onSelectRoute={() => selectRoute(arrival, station)}
        />
      ))}
    </div>
  );
}
