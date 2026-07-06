import type { BusArrival, BusStation } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { ArrivalList } from './ArrivalList'
import { DetailsPanelHeader } from './DetailsPanelHeader'
import type { ArrivalStatus } from './types'

type DetailsPanelProps = {
  activeTab: MobileTab
  station: BusStation
  arrivals: BusArrival[]
  isFavorite: (stationId: string, routeId: string) => boolean
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void
  arrivalStatus: ArrivalStatus
  arrivalError: string | null
  onRetryArrivals: () => void
}

export function DetailsPanel({
  activeTab,
  station,
  arrivals,
  isFavorite,
  onToggleFavorite,
  arrivalStatus,
  arrivalError,
  onRetryArrivals,
}: DetailsPanelProps) {
  return (
    <aside
      className={`${activeTab === 'details' ? 'flex' : 'hidden'} h-full min-h-0 min-w-0 flex-col overflow-hidden bg-canvas lg:flex lg:border-t lg:border-slate-200`}
      id="panel-details"
      role="tabpanel"
      aria-label="상세 패널"
    >
      <DetailsPanelHeader station={station} updatedAt={arrivals[0]?.updatedAt} />
      <section className="hover-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-slate-200 p-4 sm:p-5 lg:px-5 lg:py-4">
        <ArrivalList
          station={station}
          arrivals={arrivals}
          status={arrivalStatus}
          error={arrivalError}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onRetry={onRetryArrivals}
        />
      </section>
    </aside>
  )
}
