import type { BusStation } from '@shared/types/bus';

export function StationSummary({ station }: { station: BusStation }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <h1 className="text-lg font-bold text-slate-900">{station.name}</h1>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {station.mobileNo && (
          <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
            정류소 {station.mobileNo}
          </span>
        )}
        <span>{station.regionName}</span>
        {station.isCenterLane && (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brand">
            중앙차로
          </span>
        )}
      </div>
    </div>
  );
}
