import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { DetailsPanel } from '../details/DetailsPanel'
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
  arrivalStatus: 'loading' | 'success' | 'error'
  arrivalError: string | null
  onRetryArrivals: () => void
}

export function DashboardShell({ activeTab, station, arrivals, favorites, onTabChange, onStationSelect, isFavorite, onToggleFavorite, arrivalStatus, arrivalError, onRetryArrivals }: DashboardShellProps) {
  return (
    <div className="h-dvh min-h-0 overflow-hidden bg-canvas lg:[--left-panel:300px] lg:[--right-panel:340px] xl:[--left-panel:clamp(300px,24vw,388px)] xl:[--right-panel:clamp(340px,27vw,416px)]">
      <AppHeader onStationSelect={onStationSelect} />
      <MobileTabs activeTab={activeTab} onChange={onTabChange} />
      <div className="h-[calc(100dvh-116px)] min-h-0 lg:grid lg:h-[calc(100dvh-80px)] lg:grid-cols-[var(--left-panel)_minmax(400px,1fr)_var(--right-panel)]">
        <FavoritesPanel activeTab={activeTab} favorites={favorites} arrivals={arrivals} />
        <MapPanel activeTab={activeTab} />
        <DetailsPanel activeTab={activeTab} station={station} arrivals={arrivals} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} arrivalStatus={arrivalStatus} arrivalError={arrivalError} onRetryArrivals={onRetryArrivals} />
      </div>
    </div>
  )
}
