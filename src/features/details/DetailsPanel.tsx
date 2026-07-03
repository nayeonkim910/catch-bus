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
}

export function DetailsPanel({ activeTab, station, arrivals, isFavorite, onToggleFavorite }: DetailsPanelProps) {
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
        {arrivals.length > 0 ? (
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
