import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import type { BusArrival, BusStation } from '@shared/types/bus';
import { DetailsPanel } from '@features/details/DetailsPanel';
import { DetailsSheet } from '@features/details/DetailsSheet';
import { MapPanel } from '@features/map/MapPanel';
import type { SelectedRoute } from '@features/map/selectedRoute';
import { AppHeader } from './AppHeader';
import './dashboardLayout.css';

type DashboardShellProps = {
  station: BusStation | null;
  selectionSeq: number;
  selectedRoute: SelectedRoute | null;
  onStationSelect: (station: BusStation) => void;
  onSelectRoute: (arrival: BusArrival) => void;
  onClearRoute: () => void;
};

export function DashboardShell({
  station,
  selectionSeq,
  selectedRoute,
  onStationSelect,
  onSelectRoute,
  onClearRoute,
}: DashboardShellProps) {
  // 데스크톱은 좌측 고정 패널, 모바일은 바텀시트. 동작이 달라 컨테이너를 갈라 렌더한다.
  // 1024px는 dashboardLayout.css의 lg 브레이크포인트와 일치시킨다.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const detailProps = {
    station,
    selectedRouteId: selectedRoute?.routeId ?? null,
    onSelectRoute,
  };
  return (
    <div className="dashboard-shell">
      <AppHeader onStationSelect={onStationSelect} />
      <div className="dashboard-stage">
        <div className="dashboard-content">
          <MapPanel
            station={station}
            selectedRoute={selectedRoute}
            onStationSelect={onStationSelect}
            onClearRoute={onClearRoute}
          />
          {isDesktop ? (
            <DetailsPanel {...detailProps} />
          ) : (
            <DetailsSheet {...detailProps} selectionSeq={selectionSeq} />
          )}
        </div>
      </div>
    </div>
  );
}
