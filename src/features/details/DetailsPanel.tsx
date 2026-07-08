import type { BusArrival, BusStation } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { ArrivalList } from './ArrivalList'
import { DetailsPanelHeader } from './DetailsPanelHeader'
import type { ArrivalStatus } from './types'

type DetailsPanelProps = {
  activeTab: MobileTab
  station: BusStation | null
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
      {station ? (
        <>
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
        </>
      ) : (
        <section className="grid min-h-0 flex-1 place-items-center p-6 text-center">
          <div className="max-w-sm rounded-xl border border-dashed border-slate-300 bg-white p-8">
            <h2 className="text-lg font-bold text-slate-800">정류장을 선택해 주세요</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              지도에서 정류장 마커를 선택하거나 상단 검색창에서 정류장을 검색하면
              도착정보를 확인할 수 있습니다.
            </p>
          </div>
        </section>
      )}
    </aside>
  )
}
