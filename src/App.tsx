import { useCallback, useState } from 'react';
import type { ArrivalStatus } from './features/details/types';
import { useStationArrivals } from './features/details/useStationArrivals';
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

  // 선택 정류장 도착정보. 30초 폴링으로 갱신되고, 즐겨찾기와 같은 queryKey로 캐시를 공유한다.
  const { data, isPending, isError, error, refetch } = useStationArrivals(station?.id ?? null);
  const arrivals = data ?? [];
  // 하위 컴포넌트가 기대하는 상태 모델로 변환한다. 폴링 재조회 때 스켈레톤이 깜빡이지 않도록
  // isFetching이 아니라 첫 로드(isPending)만 'loading'으로 본다.
  const arrivalStatus: ArrivalStatus =
    station === null ? 'idle' : isError ? 'error' : isPending ? 'loading' : 'success';
  const arrivalError = error instanceof Error ? error.message : null;

  const handleStationSelect = useCallback((nextStation: BusStation) => {
    setStation(nextStation);
    // 선택 노선은 직전 정류장 맥락이었으므로 정류장이 바뀌면 지도 오버레이를 걷어낸다.
    setSelectedRoute(null);
    setActiveTab('details');
    // 도착정보 조회는 station 변경에 따라 useStationArrivals가 queryKey로 자동 수행한다.
  }, []);

  const handleRetryArrivals = useCallback(() => {
    void refetch();
  }, [refetch]);

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
      arrivals={arrivals}
      favorites={favorites}
      selectedRoute={selectedRoute}
      onTabChange={setActiveTab}
      onStationSelect={handleStationSelect}
      arrivalStatus={arrivalStatus}
      arrivalError={arrivalError}
      onRetryArrivals={handleRetryArrivals}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      onSelectRoute={handleSelectRoute}
      onClearRoute={handleClearRoute}
    />
  );
}

export default App;
