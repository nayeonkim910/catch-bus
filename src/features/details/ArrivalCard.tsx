import { useId, useState } from 'react'
import { StarIcon } from '../../shared/components/Icons'
import { RouteBadge } from '../../shared/components/RouteBadge'
import { RouteProgress } from '../../shared/components/RouteProgress'
import type { BusArrival } from '../../shared/types/bus'
import { formatArrivalTime } from '../../shared/utils/arrival'
import { useRouteStationData } from '../routes/useRouteStationData'
import { RouteStationDetails } from './RouteStationDetails'

type ArrivalCardProps = {
  arrival: BusArrival
  targetStationName: string
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ArrivalCard({ arrival, targetStationName, isFavorite, onToggleFavorite }: ArrivalCardProps) {
  const [isRouteExpanded, setIsRouteExpanded] = useState(false)
  const routeDetailsId = useId()
  const first = arrival.first
  const routeStationData = useRouteStationData(
    arrival.routeId,
    arrival.stationId,
    arrival.stationOrder,
  )

  return (
    <article className="relative rounded-xl border-2 border-slate-300 bg-white p-4 shadow-sm transition-[border-color,box-shadow,background-color] hover:border-blue-700 hover:bg-blue-50 hover:shadow-xl hover:ring-4 hover:ring-blue-300 focus-within:border-blue-700 focus-within:bg-blue-50 focus-within:ring-4 focus-within:ring-blue-300 lg:grid lg:grid-cols-[minmax(180px,0.75fr)_minmax(280px,1.4fr)_minmax(130px,0.5fr)] lg:items-center lg:gap-4 lg:p-3">
      <div className="flex items-start justify-between gap-3 lg:block">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <RouteBadge routeName={arrival.routeName} routeTypeCode={arrival.routeTypeCode} />
            <span className="truncate text-sm font-semibold text-slate-700">{arrival.destinationName} 방면</span>
          </div>
          <div className="mt-3 flex items-end gap-2 lg:mt-2 lg:block">
            <strong className="text-xl text-brand">
              {formatArrivalTime(first?.arrivalSeconds ?? null)}
            </strong>
            <p className="text-xs text-slate-500 lg:mt-1">
              {first?.remainingStops != null
                ? `${first.remainingStops}정거장 전`
                : '남은 정거장 정보 없음'}
              {first?.isLowFloor ? ' · 저상버스' : ''}
            </p>
          </div>
        </div>
        <button
          className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border transition-colors lg:absolute lg:top-3 lg:right-3 lg:size-9 ${isFavorite ? 'border-amber-300 bg-amber-50 text-amber-500' : 'border-slate-200 bg-white text-slate-400 hover:text-amber-500'}`}
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
        routeTypeCode={arrival.routeTypeCode}
        stationNames={routeStationData.data?.timeline}
        horizontal
      />

      <div className="mt-4 border-t border-slate-100 pt-4 text-right text-sm text-slate-500 lg:mt-0 lg:border-0 lg:pr-12 lg:pt-0">
        <span className="block text-xs text-slate-400">다음 버스</span>
        <strong className="mt-1 block text-base font-semibold text-slate-600">
          {arrival.second
            ? formatArrivalTime(arrival.second.arrivalSeconds)
            : '정보 없음'}
        </strong>
        <button
          className="mt-2 cursor-pointer text-xs font-semibold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          type="button"
          aria-expanded={isRouteExpanded}
          aria-controls={routeDetailsId}
          onClick={() => setIsRouteExpanded((expanded) => !expanded)}
        >
          {isRouteExpanded ? '상세 노선 닫기' : '상세 노선 보기'}
        </button>
      </div>

      {isRouteExpanded && (
        <RouteStationDetails
          id={routeDetailsId}
          stations={routeStationData.data?.stations}
          targetStationId={arrival.stationId}
          targetStationOrder={arrival.stationOrder}
          currentStationSequence={first?.currentStationSequence ?? null}
          routeTypeCode={arrival.routeTypeCode}
          isLoading={routeStationData.isLoading}
        />
      )}
    </article>
  )
}
