import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { DetailsPanel } from '../details/DetailsPanel'
import type { ArrivalStatus } from '../details/types'
import { MapPanel } from '../map/MapPanel'
import { AppHeader } from './AppHeader'
import './dashboardLayout.css'
import { MobileTabs } from './MobileTabs'

type DashboardShellProps = {
  activeTab: MobileTab
  station: BusStation | null
  arrivals: BusArrival[]
  favorites: Favorite[]
  onTabChange: (tab: MobileTab) => void
  onStationSelect: (station: BusStation) => void
  isFavorite: (stationId: string, routeId: string) => boolean
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void
  arrivalStatus: ArrivalStatus
  arrivalError: string | null
  onRetryArrivals: () => void
}

export function DashboardShell({
  activeTab,
  station,
  arrivals,
  favorites,
  onTabChange,
  onStationSelect,
  isFavorite,
  onToggleFavorite,
  arrivalStatus,
  arrivalError,
  onRetryArrivals,
}: DashboardShellProps) {
  return (
    <div className="dashboard-shell">
      <AppHeader onStationSelect={onStationSelect} />
      <MobileTabs activeTab={activeTab} onChange={onTabChange} />
      <div className="dashboard-stage">
        <div className="dashboard-content">
          <MapPanel
            activeTab={activeTab}
            station={station}
            onStationSelect={onStationSelect}
          />
          <DetailsPanel
            // 정류장이 바뀌면 하단 패널의 탭과 높이 상태를 기본값으로 되돌린다.
            key={station?.id ?? 'no-station'}
            activeTab={activeTab}
            station={station}
            arrivals={arrivals}
            favorites={favorites}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            arrivalStatus={arrivalStatus}
            arrivalError={arrivalError}
            onRetryArrivals={onRetryArrivals}
          />
        </div>
      </div>
    </div>
  )
}
