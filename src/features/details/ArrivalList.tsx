import type { BusArrival, BusStation } from '../../shared/types/bus';
import { ArrivalCard } from './ArrivalCard';

type ArrivalListProps = {
  station: BusStation;
  arrivals: BusArrival[];
  selectedRouteId: string | null;
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  onSelectRoute: (arrival: BusArrival) => void;
};

export function ArrivalList({
  station,
  arrivals,
  selectedRouteId,
  isFavorite,
  onToggleFavorite,
  onSelectRoute,
}: ArrivalListProps) {
  return (
    <div className="space-y-3">
      {arrivals.map((arrival) => (
        <ArrivalCard
          key={arrival.routeId}
          arrival={arrival}
          isFavorite={isFavorite(station.id, arrival.routeId)}
          isRouteSelected={arrival.routeId === selectedRouteId}
          onToggleFavorite={() => onToggleFavorite(station, arrival)}
          onSelectRoute={() => onSelectRoute(arrival)}
        />
      ))}
    </div>
  );
}
