import { useCallback, useEffect, useRef, useState } from 'react';
import type { ArrivalStatus } from './features/details/types';
import { useFavorites } from './features/favorites/useFavorites';
import { DashboardShell } from './features/layout/DashboardShell';
import { createSelectedRoute, type SelectedRoute } from './features/map/selectedRoute';
import type { BusArrival, BusStation } from './shared/types/bus';
import { getStationArrivals } from './lib/busApi';
import type { MobileTab } from './shared/types/navigation';

type ArrivalState = {
  status: ArrivalStatus;
  arrivals: BusArrival[];
  error: string | null;
};

const INITIAL_ARRIVAL_STATE: ArrivalState = {
  status: 'idle',
  arrivals: [],
  error: null,
};

function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('map');
  // 정류장을 선택하기 전에는 실제 도착정보처럼 보일 수 있는 기본 데이터를 두지 않는다.
  const [station, setStation] = useState<BusStation | null>(null);
  const [arrivalState, setArrivalState] = useState<ArrivalState>(INITIAL_ARRIVAL_STATE);
  // 지도에 노선·실시간 차량을 시각화할 선택 노선. 정류장을 바꾸면 초기화한다.
  const [selectedRoute, setSelectedRoute] = useState<SelectedRoute | null>(null);
  const arrivalRequestRef = useRef<AbortController | null>(null);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const loadStationArrivals = useCallback(async (nextStation: BusStation) => {
    arrivalRequestRef.current?.abort();
    const controller = new AbortController();
    arrivalRequestRef.current = controller;
    setArrivalState({ status: 'loading', arrivals: [], error: null });

    try {
      const result = await getStationArrivals(nextStation.id, controller.signal);
      setArrivalState({ status: 'success', arrivals: result.data.arrivals, error: null });
    } catch (error) {
      if (controller.signal.aborted) return;

      setArrivalState({
        status: 'error',
        arrivals: [],
        error: error instanceof Error ? error.message : '도착정보를 불러오지 못했습니다.',
      });
    } finally {
      if (arrivalRequestRef.current === controller) {
        arrivalRequestRef.current = null;
      }
    }
  }, []);

  const handleStationSelect = useCallback(
    (nextStation: BusStation) => {
      setStation(nextStation);
      // 선택 노선은 직전 정류장 맥락이었으므로 정류장이 바뀌면 지도 오버레이를 걷어낸다.
      setSelectedRoute(null);
      setActiveTab('details');
      void loadStationArrivals(nextStation);
    },
    [loadStationArrivals],
  );

  const handleRetryArrivals = useCallback(() => {
    if (!station) return;
    void loadStationArrivals(station);
  }, [loadStationArrivals, station]);

  const handleSelectRoute = useCallback((arrival: BusArrival) => {
    // 같은 노선을 다시 누르면 해제(토글)한다.
    setSelectedRoute((current) =>
      current?.routeId === arrival.routeId ? null : createSelectedRoute(arrival),
    );
  }, []);

  const handleClearRoute = useCallback(() => setSelectedRoute(null), []);

  useEffect(() => {
    return () => arrivalRequestRef.current?.abort();
  }, []);

  return (
    <DashboardShell
      activeTab={activeTab}
      station={station}
      arrivals={arrivalState.arrivals}
      favorites={favorites}
      selectedRoute={selectedRoute}
      onTabChange={setActiveTab}
      onStationSelect={handleStationSelect}
      arrivalStatus={arrivalState.status}
      arrivalError={arrivalState.error}
      onRetryArrivals={handleRetryArrivals}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      onSelectRoute={handleSelectRoute}
      onClearRoute={handleClearRoute}
    />
  );
}

export default App;
