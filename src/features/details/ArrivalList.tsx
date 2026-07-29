import { useMemo } from 'react';
import type { BusArrival, BusStation } from '@shared/types/bus';
import { ArrivalCard } from './ArrivalCard';

type ArrivalListProps = {
  station: BusStation;
  arrivals: BusArrival[];
  selectedRouteId: string | null;
  onSelectRoute: (arrival: BusArrival) => void;
};
// 임박순 정렬 키. 도착 예정이 없는 노선(운행 종료·정보 없음)은 맨 아래로 이동.
function arrivalRank(arrival: BusArrival) {
  return arrival.first?.arrivalSeconds ?? Number.POSITIVE_INFINITY;
}

export function ArrivalList({
  station,
  arrivals,
  selectedRouteId,
  onSelectRoute,
}: ArrivalListProps) {
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
          onSelectRoute={() => onSelectRoute(arrival)}
        />
      ))}
    </div>
  );
}
