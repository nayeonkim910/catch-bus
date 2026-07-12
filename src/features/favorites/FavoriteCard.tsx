import type { BusArrival, Favorite } from '../../shared/types/bus'
import { RouteProgress } from '../../shared/components/RouteProgress'
import { RouteBadge } from '../../shared/components/RouteBadge'
import { formatArrivalTime } from '../../shared/utils/arrival'
import { useRouteStationData } from '../routes/useRouteStationData'
import { getFavoriteArrivalLabel } from './favoriteCardStatus'

type FavoriteCardProps = {
  favorite: Favorite
  arrival?: BusArrival
  isLoading?: boolean
  isError?: boolean
}

export function FavoriteCard({
  favorite,
  arrival,
  isLoading = false,
  isError = false,
}: FavoriteCardProps) {
  const first = arrival?.first
  const routeStationData = useRouteStationData(
    favorite.routeId,
    favorite.stationId,
    favorite.stationOrder,
  )

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <RouteBadge routeName={favorite.routeName} routeTypeCode={favorite.routeTypeCode} />
          <span className="truncate text-sm font-semibold text-slate-700">{favorite.destinationName} 방면</span>
        </div>
        <strong className="shrink-0 text-lg text-brand">
          {arrival ? formatArrivalTime(first?.arrivalSeconds ?? null) : '—'}
        </strong>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-700">{favorite.stationName}</p>
      <RouteProgress
        compact
        currentStationName={first?.currentStationName ?? null}
        destinationStationName={favorite.stationName}
        remainingStops={first?.remainingStops ?? null}
        routeTypeCode={favorite.routeTypeCode}
        stationNames={routeStationData.data?.timeline}
      />
      <p className="mt-2 text-right text-xs text-slate-500">
        {getFavoriteArrivalLabel({ arrival, isLoading, isError })}
      </p>
    </article>
  )
}
