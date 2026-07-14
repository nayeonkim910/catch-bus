import type { BusArrival, BusStation } from '../../shared/types/bus';
import { ArrivalCard } from './ArrivalCard';
import type { ArrivalStatus } from './types';

type ArrivalListProps = {
  station: BusStation;
  arrivals: BusArrival[];
  status: ArrivalStatus;
  error: string | null;
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  onRetry: () => void;
};

function LoadingArrivals() {
  return (
    <div className="space-y-3" aria-live="polite" aria-label="도착정보를 불러오는 중">
      {[0, 1, 2].map((item) => (
        <div
          className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white lg:h-24"
          key={item}
        />
      ))}
    </div>
  );
}

function ArrivalError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
      <p className="text-sm text-red-700" role="alert">
        {message ?? '도착정보를 불러오지 못했습니다.'}
      </p>
      <button
        className="mt-3 cursor-pointer rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-500"
        onClick={onRetry}
        type="button"
      >
        다시 시도
      </button>
    </div>
  );
}

function EmptyArrivals() {
  return (
    <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      도착 예정 버스가 없습니다.
    </p>
  );
}

export function ArrivalList({
  station,
  arrivals,
  status,
  error,
  isFavorite,
  onToggleFavorite,
  onRetry,
}: ArrivalListProps) {
  if (status === 'loading') return <LoadingArrivals />;
  if (status === 'error') return <ArrivalError message={error} onRetry={onRetry} />;
  if (arrivals.length === 0) return <EmptyArrivals />;

  return (
    <div className="space-y-3">
      {arrivals.map((arrival) => (
        <ArrivalCard
          key={arrival.routeId}
          arrival={arrival}
          targetStationName={station.name}
          isFavorite={isFavorite(station.id, arrival.routeId)}
          onToggleFavorite={() => onToggleFavorite(station, arrival)}
        />
      ))}
    </div>
  );
}
