import type { MobileTab } from '../../shared/types/navigation'
import { DetailsPanel } from '../details/DetailsPanel'
import { FavoritesPanel } from '../favorites/FavoritesPanel'
import { MapPanel } from '../map/MapPanel'
import { AppHeader } from './AppHeader'
import { MobileTabs } from './MobileTabs'

type DashboardShellProps = {
  activeTab: MobileTab
  onTabChange: (tab: MobileTab) => void
}

export function DashboardShell({ activeTab, onTabChange }: DashboardShellProps) {
  return (
    <div className="h-dvh min-h-0 overflow-hidden bg-canvas lg:[--left-panel:300px] lg:[--right-panel:340px] xl:[--left-panel:clamp(300px,24vw,388px)] xl:[--right-panel:clamp(340px,27vw,416px)]">
      <AppHeader />
      <MobileTabs activeTab={activeTab} onChange={onTabChange} />
      <div className="h-[calc(100dvh-116px)] min-h-0 lg:grid lg:h-[calc(100dvh-80px)] lg:grid-cols-[var(--left-panel)_minmax(400px,1fr)_var(--right-panel)]">
        <FavoritesPanel activeTab={activeTab} />
        <MapPanel activeTab={activeTab} />
        <DetailsPanel activeTab={activeTab} />
      </div>
    </div>
  )
}
