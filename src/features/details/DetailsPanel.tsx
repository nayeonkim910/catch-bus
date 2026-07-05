import { SectionHeading } from '../../shared/components/PanelSection'
import type { BusArrival, BusStation } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { formatUpdatedTime } from '../../shared/utils/arrival'
import { ArrivalCard } from './ArrivalCard'
import { StationSummary } from './StationSummary'

type DetailsPanelProps = {
  activeTab: MobileTab
  station: BusStation
  arrivals: BusArrival[]
  isFavorite: (stationId: string, routeId: string) => boolean
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void
  arrivalStatus: 'loading' | 'success' | 'error'
  arrivalError: string | null
  onRetryArrivals: () => void
}

export function DetailsPanel({ activeTab, station, arrivals, isFavorite, onToggleFavorite, arrivalStatus, arrivalError, onRetryArrivals }: DetailsPanelProps) {
  const latestUpdatedAt = arrivals[0]?.updatedAt

  return (
    <aside className={`${activeTab === 'details' ? 'flex' : 'hidden'} h-full min-h-0 min-w-0 flex-col overflow-y-auto bg-canvas lg:flex lg:border-l lg:border-slate-200`} id="panel-details" role="tabpanel" aria-label="상세 패널">
      <section className="shrink-0 p-4 sm:p-5 lg:p-6 lg:px-5">
        <SectionHeading>정류장 상세</SectionHeading>
        <StationSummary station={station} />
      </section>
      <section className="flex-1 border-t border-slate-200 p-4 sm:p-5 lg:p-6 lg:px-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-slate-900">도착정보</h2>
          {latestUpdatedAt && <span className="text-xs text-slate-400">{formatUpdatedTime(latestUpdatedAt)} 기준</span>}
        </div>
        {arrivalStatus === 'loading' ? (
          <div className="space-y-3" aria-live="polite" aria-label="도착정보를 불러오는 중">
            {[0, 1, 2].map((item) => (
              <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" key={item} />
            ))}
          </div>
        ) : arrivalStatus === 'error' ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="text-sm text-red-700" role="alert">{arrivalError ?? '도착정보를 불러오지 못했습니다.'}</p>
            <button className="mt-3 cursor-pointer rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-red-500" onClick={onRetryArrivals} type="button">다시 시도</button>
          </div>
        ) : arrivals.length > 0 ? (
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
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">도착 예정 버스가 없습니다.</p>
        )}
      </section>
    </aside>
  )
}
