import type { BusArrival, Favorite } from '../../shared/types/bus'
import { RouteProgress } from '../../shared/components/RouteProgress'
import { formatArrivalTime } from '../../shared/utils/arrival'

type FavoriteCardProps = {
  favorite: Favorite
  arrival?: BusArrival
}

export function FavoriteCard({ favorite, arrival }: FavoriteCardProps) {
  const first = arrival?.first

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-md bg-blue-600 px-2 py-1 text-sm font-bold text-white">{favorite.routeName}</span>
          <span className="truncate text-sm font-semibold text-slate-700">{favorite.destinationName} 방면</span>
        </div>
        <strong className="shrink-0 text-lg text-brand">{formatArrivalTime(first?.arrivalSeconds ?? null)}</strong>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-700">{favorite.stationName}</p>
      <RouteProgress
        compact
        currentStationName={first?.currentStationName ?? null}
        destinationStationName={favorite.stationName}
        remainingStops={first?.remainingStops ?? null}
      />
      <p className="mt-2 text-right text-xs text-slate-500">
        {first?.remainingStops != null ? `${first.remainingStops}정거장 전` : '위치 정보 없음'}
      </p>
    </article>
  )
}
