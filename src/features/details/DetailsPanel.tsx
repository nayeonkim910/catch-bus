import type { BusArrival, BusStation } from '../../shared/types/bus';
import { DetailsContent } from './DetailsContent';

type DetailsPanelProps = {
  station: BusStation | null;
  selectedRouteId: string | null;
  onSelectRoute: (arrival: BusArrival) => void;
};

/**
 * 상세 패널의 데스크톱 컨테이너. 좌측 고정 패널로 상시 노출한다.
 * 모바일은 DetailsSheet가 같은 콘텐츠를 시트로 담는다.
 */
export function DetailsPanel({ station, ...content }: DetailsPanelProps) {
  return (
    <aside className="details-panel flex" id="panel-details" aria-label="상세 패널">
      {/* 정류장이 바뀌면 콘텐츠를 리마운트해 탭을 기본값(버스 상세)으로 되돌린다. */}
      <DetailsContent key={station?.id ?? 'no-station'} station={station} {...content} />
    </aside>
  );
}
