import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import { DetailsPanel } from '@features/details/DetailsPanel';
import { DetailsSheet } from '@features/details/DetailsSheet';
import { MapPanel } from '@features/map/MapPanel';
import { AppHeader } from './AppHeader';
import './dashboardLayout.css';

export function DashboardShell() {
  // 데스크톱은 좌측 고정 패널, 모바일은 바텀시트. 동작이 달라 컨테이너를 갈라 렌더한다.
  // 1024px는 dashboardLayout.css의 lg 브레이크포인트와 일치시킨다.
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="dashboard-shell">
      <AppHeader />
      <div className="dashboard-stage">
        <div className="dashboard-content">
          <MapPanel />
          {isDesktop ? <DetailsPanel /> : <DetailsSheet />}
        </div>
      </div>
    </div>
  );
}
