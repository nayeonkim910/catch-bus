import type { BusArrival, BusStation } from '../../shared/types/bus';
import { ArrivalCard } from './ArrivalCard';

type ArrivalListProps = {
  station: BusStation;
  arrivals: BusArrival[];
  selectedRouteId: string | null;
  onSelectRoute: (arrival: BusArrival) => void;
};

export function ArrivalList({
  station,
  arrivals,
  selectedRouteId,
  onSelectRoute,
}: ArrivalListProps) {
  return (
    <div className="space-y-3">
      {arrivals.map((arrival) => (
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
