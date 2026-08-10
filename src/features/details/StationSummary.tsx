import type { BusStation } from '@shared/types/bus';

export function StationSummary({ station }: { station: BusStation }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-card p-4 shadow-sm lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <h1 className="text-lg font-bold text-foreground">{station.name}</h1>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {station.mobileNo && (
          <span className="rounded-md bg-muted px-2 py-1 font-medium text-muted-foreground">
            정류소 {station.mobileNo}
          </span>
        )}
        <span>{station.regionName}</span>
        {station.isCenterLane && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
            중앙차로
          </span>
        )}
      </div>
    </div>
  );
}
