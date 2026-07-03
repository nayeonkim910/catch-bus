import { useState } from 'react'
import { useFavorites } from './features/favorites/useFavorites'
import { DashboardShell } from './features/layout/DashboardShell'
import { selectedStation, stationArrivals } from './shared/mock/busData'
import type { MobileTab } from './shared/types/navigation'

function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('map')
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  return (
    <DashboardShell
      activeTab={activeTab}
      station={selectedStation}
      arrivals={stationArrivals}
      favorites={favorites}
      onTabChange={setActiveTab}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
    />
  )
}

export default App
