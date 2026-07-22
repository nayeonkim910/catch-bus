import { useCallback, useState } from 'react';
import { useFavorites } from './features/favorites/useFavorites';
import { DashboardShell } from './features/layout/DashboardShell';
import { createSelectedRoute, type SelectedRoute } from './features/map/selectedRoute';
import type { BusArrival, BusStation } from './shared/types/bus';
import type { MobileTab } from './shared/types/navigation';

function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('map');
  // 정류장을 선택하기 전에는 실제 도착정보처럼 보일 수 있는 기본 데이터를 두지 않는다.
  const [station, setStation] = useState<BusStation | null>(null);
  // 지도에 노선·실시간 차량을 시각화할 선택 노선. 정류장을 바꾸면 초기화한다.
  const [selectedRoute, setSelectedRoute] = useState<SelectedRoute | null>(null);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const handleStationSelect = useCallback((nextStation: BusStation) => {
    setStation(nextStation);
    // 선택 노선은 직전 정류장 맥락이었으므로 정류장이 바뀌면 지도 오버레이를 걷어낸다.
    setSelectedRoute(null);
    setActiveTab('details');
    // 도착정보는 StationArrivalsPanel이 station을 받아 직접 조회한다(콜로케이션).
  }, []);

  const handleSelectRoute = useCallback((arrival: BusArrival) => {
    // 같은 노선을 다시 누르면 해제(토글)한다.
    setSelectedRoute((current) =>
      current?.routeId === arrival.routeId ? null : createSelectedRoute(arrival),
    );
  }, []);

  const handleClearRoute = useCallback(() => setSelectedRoute(null), []);

  return (
    <DashboardShell
      activeTab={activeTab}
      station={station}
      favorites={favorites}
      selectedRoute={selectedRoute}
      onTabChange={setActiveTab}
      onStationSelect={handleStationSelect}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      onSelectRoute={handleSelectRoute}
      onClearRoute={handleClearRoute}
    />
  );
}

export default App;
