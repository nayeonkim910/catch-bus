import { EmptyState } from '../../shared/components/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/components/ui/Tabs';
import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';
import type { MobileTab } from '../../shared/types/navigation';
import { FavoritesTab } from './FavoritesTab';
import { StationArrivalsPanel } from './StationArrivalsPanel';

type DetailsPanelProps = {
  activeTab: MobileTab;
  station: BusStation | null;
  favorites: Favorite[];
  selectedRouteId: string | null;
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  onSelectRoute: (arrival: BusArrival) => void;
};

export function DetailsPanel({
  activeTab,
  station,
  favorites,
  selectedRouteId,
  isFavorite,
  onToggleFavorite,
  onSelectRoute,
}: DetailsPanelProps) {
  return (
    <aside
      className={`${activeTab === 'details' ? 'flex' : 'hidden'} details-panel lg:flex`}
      id="panel-details"
      role="tabpanel"
      aria-label="상세 패널"
    >
      {/* 패널 안의 콘텐츠 탭. 바깥에서 건드릴 일이 없어 비제어(defaultValue)로 둔다.
          정류장이 바뀌면 DashboardShell의 key remount로 이 탭이 기본값으로 초기화된다. */}
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
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
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
          <FavoritesTab favorites={favorites} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
