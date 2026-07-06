import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { DetailsPanel } from '../details/DetailsPanel'
import type { ArrivalStatus } from '../details/types'
import { FavoritesPanel } from '../favorites/FavoritesPanel'
import { MapPanel } from '../map/MapPanel'
import { AppHeader } from './AppHeader'
import { MobileTabs } from './MobileTabs'

type DashboardShellProps = {
  activeTab: MobileTab
  station: BusStation
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
    <div className="relative h-dvh min-h-0 overflow-hidden bg-canvas lg:[--left-panel:300px] xl:[--left-panel:clamp(300px,24vw,388px)]">
      <AppHeader onStationSelect={onStationSelect} />
      <MobileTabs activeTab={activeTab} onChange={onTabChange} />
      <div className="h-[calc(100dvh-116px)] min-h-0 lg:grid lg:h-dvh lg:grid-cols-[var(--left-panel)_minmax(0,1fr)]">
        <FavoritesPanel
          activeTab={activeTab}
          favorites={favorites}
          arrivals={arrivals}
        />
        <div className="h-full min-h-0 min-w-0 lg:grid lg:grid-rows-[minmax(260px,1fr)_minmax(240px,40vh)]">
          <MapPanel
            activeTab={activeTab}
            station={station}
            onStationSelect={onStationSelect}
          />
          <DetailsPanel
            activeTab={activeTab}
            station={station}
            arrivals={arrivals}
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
