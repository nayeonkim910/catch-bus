import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';
import { DetailsPanel } from '../details/DetailsPanel';
import { DetailsSheet } from '../details/DetailsSheet';
import { MapPanel } from '../map/MapPanel';
import type { SelectedRoute } from '../map/selectedRoute';
import { AppHeader } from './AppHeader';
import './dashboardLayout.css';

type DashboardShellProps = {
  station: BusStation | null;
  selectionSeq: number;
  favorites: Favorite[];
  selectedRoute: SelectedRoute | null;
  onStationSelect: (station: BusStation) => void;
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  onSelectRoute: (arrival: BusArrival) => void;
  onClearRoute: () => void;
};

export function DashboardShell({
  station,
  selectionSeq,
  favorites,
  selectedRoute,
  onStationSelect,
  isFavorite,
  onToggleFavorite,
  onSelectRoute,
  onClearRoute,
}: DashboardShellProps) {
  // 데스크톱은 좌측 고정 패널, 모바일은 바텀시트. 동작이 달라 컨테이너를 갈라 렌더한다.
  // 1024px는 dashboardLayout.css의 lg 브레이크포인트와 일치시킨다.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const detailProps = {
    station,
    favorites,
    selectedRouteId: selectedRoute?.routeId ?? null,
    isFavorite,
    onToggleFavorite,
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
