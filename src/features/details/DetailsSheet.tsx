import { useState } from 'react';
import { Drawer } from 'vaul';
import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';
import { DetailsContent } from './DetailsContent';

type DetailsSheetProps = {
  station: BusStation | null;
  selectionSeq: number;
  favorites: Favorite[];
  selectedRouteId: string | null;
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  onSelectRoute: (arrival: BusArrival) => void;
};

/**
 * 상세 패널의 모바일 컨테이너. 지도 위로 바텀시트가 떠오른다.
 * (데스크톱은 DetailsPanel이 같은 DetailsContent를 좌측 고정 패널로 담는다.)
 *
 * 정류장을 선택할 때마다 열린다(같은 정류장 재선택 포함 — App의 selectionSeq 증가를 감지).
 * 배경을 탭하거나 아래로 내리면 닫히고, 마커를 다시 탭하면 다시 열린다. 열림 상태는 시트가 소유.
 */
export function DetailsSheet({ station, selectionSeq, ...content }: DetailsSheetProps) {
  const [open, setOpen] = useState(false);

  // 정류장 선택 이벤트(selectionSeq)마다 연다. prop 변경 조정이라 effect 대신 렌더 중 비교한다.
  const [prevSeq, setPrevSeq] = useState(selectionSeq);
  if (selectionSeq !== prevSeq) {
    setPrevSeq(selectionSeq);
    setOpen(true);
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-2xl border-t border-border bg-card outline-none"
          aria-describedby={undefined}
        >
          <div className="mx-auto my-3 h-1.5 w-10 shrink-0 rounded-full bg-muted" aria-hidden />
          <Drawer.Title className="sr-only">정류장 상세</Drawer.Title>
          {/* 정류장이 바뀌면 콘텐츠를 리마운트해 탭을 기본값(버스 상세)으로 되돌린다. */}
          <DetailsContent key={station?.id ?? 'no-station'} station={station} {...content} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
