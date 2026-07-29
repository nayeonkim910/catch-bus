import type { BusArrival } from '@shared/types/bus';
import { formatArrivalTime } from '@shared/utils/arrival';
import { getNoArrivalLabel, isArrivalImminent } from './arrivalCardStatus';

type ArrivalHeroProps = {
  arrival: BusArrival;
};

export function ArrivalHero({ arrival }: ArrivalHeroProps) {
  const firstArrivalSeconds = arrival.first?.arrivalSeconds ?? null;

  if (firstArrivalSeconds == null) {
    return (
      <p className="mt-1 truncate text-xs text-muted-foreground">
        {getNoArrivalLabel(arrival.status)}
      </p>
    );
  }

  const isImminent = isArrivalImminent(firstArrivalSeconds);
  const secondArrivalSeconds = arrival.second?.arrivalSeconds ?? null;

  return (
    <div className="mt-1 flex items-end justify-between gap-2">
      <strong
        className={`text-3xl leading-none font-bold ${
          isImminent ? 'text-arrival-imminent' : 'text-foreground'
        }`}
      >
        {formatArrivalTime(firstArrivalSeconds)}
      </strong>
      {secondArrivalSeconds != null && (
        <span className="shrink-0 text-xs font-medium whitespace-nowrap text-muted-foreground">
          다음 {formatArrivalTime(secondArrivalSeconds)}
        </span>
      )}
    </div>
  );
}
