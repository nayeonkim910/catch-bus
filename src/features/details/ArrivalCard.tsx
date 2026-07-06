import { StarIcon } from '../../shared/components/Icons'
import { RouteBadge } from '../../shared/components/RouteBadge'
import { RouteProgress } from '../../shared/components/RouteProgress'
import type { BusArrival } from '../../shared/types/bus'
import { formatArrivalTime } from '../../shared/utils/arrival'

type ArrivalCardProps = {
  arrival: BusArrival
  targetStationName: string
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ArrivalCard({ arrival, targetStationName, isFavorite, onToggleFavorite }: ArrivalCardProps) {
  const first = arrival.first

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <RouteBadge routeName={arrival.routeName} routeTypeCode={arrival.routeTypeCode} />
            <span className="truncate text-sm font-semibold text-slate-700">{arrival.destinationName} 방면</span>
          </div>
        </div>
        <button
          className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border transition-colors ${isFavorite ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-slate-200 bg-white text-slate-400 hover:text-amber-500'}`}
          type="button"
          aria-label={`${arrival.routeName}번 즐겨찾기 ${isFavorite ? '삭제' : '추가'}`}
          aria-pressed={isFavorite}
          onClick={onToggleFavorite}
        >
          <StarIcon filled={isFavorite} />
        </button>
      </div>

      <RouteProgress
        currentStationName={first?.currentStationName ?? null}
        destinationStationName={targetStationName}
        remainingStops={first?.remainingStops ?? null}
      />

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
        <div>
          <strong className="text-xl text-brand">{formatArrivalTime(first?.arrivalSeconds ?? null)}</strong>
          <p className="mt-1 text-xs text-slate-500">
            {first?.remainingStops != null ? `${first.remainingStops}정거장 전` : '남은 정거장 정보 없음'}
            {first?.isLowFloor ? ' · 저상버스' : ''}
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <span className="block text-xs text-slate-400">다음 버스</span>
          {arrival.second ? formatArrivalTime(arrival.second.arrivalSeconds) : '정보 없음'}
        </div>
      </div>
    </article>
  )
}
