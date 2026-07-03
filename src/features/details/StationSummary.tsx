import type { BusStation } from '../../shared/types/bus'

export function StationSummary({ station }: { station: BusStation }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">{station.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {station.mobileNo ?? '정류소 번호 없음'} · {station.regionName}
          </p>
        </div>
        {station.isCenterLane && (
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brand">중앙차로</span>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-400">정류소 ID {station.id}</p>
    </div>
  )
}
