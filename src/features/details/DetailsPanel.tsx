import { useSelectionStore } from '@features/selection/selectionStore';
import { DetailsContent } from './DetailsContent';

/**
 * 상세 패널의 데스크톱 컨테이너. 좌측 고정 패널로 상시 노출한다.
 * 모바일은 DetailsSheet가 같은 콘텐츠를 시트로 담는다.
 */
export function DetailsPanel() {
  const station = useSelectionStore((state) => state.station);

  return (
    <aside
      className="absolute inset-y-4 left-4 z-20 flex w-(--details-panel) flex-col overflow-hidden rounded-[1.25rem] border border-border/70 bg-card/90 shadow-[0_20px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl"
      aria-label="상세 패널"
    >
      {/* 정류장이 바뀌면 콘텐츠를 리마운트해 탭을 기본값(버스 상세)으로 되돌린다. */}
      <DetailsContent key={station?.id ?? 'no-station'} station={station} />
    </aside>
  );
}
