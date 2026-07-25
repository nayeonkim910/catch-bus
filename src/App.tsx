import { useCallback, useState } from 'react';
import { DashboardShell } from './features/layout/DashboardShell';
import { createSelectedRoute, type SelectedRoute } from './features/map/selectedRoute';
import type { BusArrival, BusStation } from './shared/types/bus';

function App() {
  // 지도에서 고른 정류장. Map ↔ Details가 실제로 공유하는 상태다.
  const [station, setStation] = useState<BusStation | null>(null);
  // 지도에 노선·실시간 차량을 시각화할 선택 노선. 정류장을 바꾸면 초기화한다.
  const [selectedRoute, setSelectedRoute] = useState<SelectedRoute | null>(null);
  // 정류장 "선택 이벤트" 카운터. 같은 정류장을 다시 눌러도 증가해 모바일 시트를 다시 연다.
  const [selectionSeq, setSelectionSeq] = useState(0);

  const handleStationSelect = useCallback((nextStation: BusStation) => {
    setStation(nextStation);
    // 선택 노선은 직전 정류장 맥락이었으므로 정류장이 바뀌면 지도 오버레이를 걷어낸다.
    setSelectedRoute(null);
    // 선택 이벤트를 증가시켜 DetailsSheet(모바일)가 열리도록 한다(같은 정류장 재선택 포함).
    setSelectionSeq((seq) => seq + 1);
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
      station={station}
      selectionSeq={selectionSeq}
      selectedRoute={selectedRoute}
      onStationSelect={handleStationSelect}
      onSelectRoute={handleSelectRoute}
      onClearRoute={handleClearRoute}
    />
  );
}

export default App;
