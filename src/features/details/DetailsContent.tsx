import { EmptyState } from '@shared/components/ui/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/Tabs';
import type { BusArrival, BusStation } from '@shared/types/bus';
import { FavoritesTab } from './FavoritesTab';
import { StationArrivalsPanel } from './StationArrivalsPanel';

type DetailsContentProps = {
  station: BusStation | null;
  selectedRouteId: string | null;
  onSelectRoute: (arrival: BusArrival) => void;
};

/**
 * 상세 패널의 순수 콘텐츠(버스 상세/즐겨찾기 탭 + 내용). 담는 그릇과 무관하다.
 * 데스크톱은 좌측 고정 패널(DetailsPanel), 모바일은 바텀시트가 이 콘텐츠를 담는다.
 */
export function DetailsContent({ station, selectedRouteId, onSelectRoute }: DetailsContentProps) {
  return (
    <Tabs defaultValue="station-detail" className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200/70 px-4 py-3 sm:px-5">
        {/* 데스크톱에선 로고가 패널 헤더의 탭 왼쪽에 온다. 모바일은 AppHeader가 로고를 보여준다. */}
        <a
          href="#panel-map"
          aria-label="Catch Bus 홈"
          className="hidden shrink-0 text-lg font-extrabold tracking-[-0.5px] text-blue-950 no-underline lg:inline-flex"
        >
          Catch&nbsp;<span className="text-brand">Bus</span>
        </a>
        <TabsList>
          <TabsTrigger value="station-detail">버스 상세</TabsTrigger>
          <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="station-detail" className="flex min-h-0 flex-1 flex-col">
        {station ? (
          <StationArrivalsPanel
            station={station}
            selectedRouteId={selectedRouteId}
            onSelectRoute={onSelectRoute}
          />
        ) : (
          <EmptyState
            title="정류장을 선택해 주세요"
            description="지도에서 정류장 마커를 선택하거나 상단 검색창에서 검색할 수 있습니다."
          />
        )}
      </TabsContent>
      <TabsContent value="favorites" className="flex min-h-0 flex-1 flex-col">
        <FavoritesTab />
      </TabsContent>
    </Tabs>
  );
}
