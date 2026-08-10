import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import { desktopMediaQuery } from '@shared/breakpoints';
import { DetailsPanel } from '@features/details/DetailsPanel';
import { DetailsSheet } from '@features/details/DetailsSheet';
import { MapPanel } from '@features/map/MapPanel';
import { AppHeader } from './AppHeader';

export function DashboardShell() {
  // 데스크톱은 좌측 고정 패널, 모바일은 바텀시트. 동작이 달라 컨테이너를 갈라 렌더한다.
  const isDesktop = useMediaQuery(desktopMediaQuery());

  return (
    <div className="relative h-dvh overflow-hidden bg-background [--header-h:4rem] lg:[--details-panel:clamp(320px,26vw,400px)]">
      <AppHeader />
      {/* AppHeader는 양쪽에 렌더되지만 흐름상 높이(--header-h)를 차지하는 건 모바일뿐이라 모바일만 빼준다. 데스크톱 헤더는 높이 0 오버레이. */}
      <div className="relative h-[calc(100dvh-var(--header-h))] lg:h-dvh">
        <MapPanel />
        {isDesktop ? <DetailsPanel /> : <DetailsSheet />}
      </div>
    </div>
  );
}
