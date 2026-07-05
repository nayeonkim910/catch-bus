import { useRef, useState } from 'react'
import { useFavorites } from './features/favorites/useFavorites'
import { DashboardShell } from './features/layout/DashboardShell'
import { selectedStation as initialStation, stationArrivals } from './shared/mock/busData'
import type { BusStation } from './shared/types/bus'
import type { BusArrival } from './shared/types/bus'
import { getStationArrivals } from './lib/busApi'
import type { MobileTab } from './shared/types/navigation'

function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('map')
  const [station, setStation] = useState<BusStation>(initialStation)
  const [arrivalState, setArrivalState] = useState<{
    status: 'loading' | 'success' | 'error'
    arrivals: BusArrival[]
    error: string | null
  }>({ status: 'success', arrivals: stationArrivals, error: null })
  const arrivalRequestRef = useRef<AbortController | null>(null)
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  async function loadStationArrivals(nextStation: BusStation) {
    arrivalRequestRef.current?.abort()
    const controller = new AbortController()
    arrivalRequestRef.current = controller
    setArrivalState({ status: 'loading', arrivals: [], error: null })

    try {
      const result = await getStationArrivals(nextStation.id, controller.signal)
      setArrivalState({ status: 'success', arrivals: result.data.arrivals, error: null })
    } catch (error) {
      if (controller.signal.aborted) return

      setArrivalState({
        status: 'error',
        arrivals: [],
        error: error instanceof Error ? error.message : '도착정보를 불러오지 못했습니다.',
      })
    }
  }

  function handleStationSelect(nextStation: BusStation) {
    setStation(nextStation)
    setActiveTab('details')
    void loadStationArrivals(nextStation)
  }

  return (
    <DashboardShell
      activeTab={activeTab}
      station={station}
      arrivals={arrivalState.arrivals}
      favorites={favorites}
      onTabChange={setActiveTab}
      onStationSelect={handleStationSelect}
      arrivalStatus={arrivalState.status}
      arrivalError={arrivalState.error}
      onRetryArrivals={() => void loadStationArrivals(station)}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
    />
  )
}

export default App
