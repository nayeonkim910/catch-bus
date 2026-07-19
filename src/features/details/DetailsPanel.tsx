import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/components/ui/Tabs';
import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';
import type { MobileTab } from '../../shared/types/navigation';
import { ArrivalList } from './ArrivalList';
import { DetailsPanelHeader } from './DetailsPanelHeader';
import type { DetailsPanelSize } from './detailsPanelTypes';
import { FavoritesTab } from './FavoritesTab';
import { PanelSizeControls } from './PanelSizeControls';
import type { ArrivalStatus } from './types';

type DetailsPanelProps = {
  activeTab: MobileTab;
  station: BusStation | null;
  arrivals: BusArrival[];
  favorites: Favorite[];
  selectedRouteId: string | null;
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  onSelectRoute: (arrival: BusArrival) => void;
  arrivalStatus: ArrivalStatus;
  arrivalError: string | null;
  onRetryArrivals: () => void;
};

export function DetailsPanel({
  activeTab,
  station,
  arrivals,
  favorites,
  selectedRouteId,
  isFavorite,
  onToggleFavorite,
  onSelectRoute,
  arrivalStatus,
  arrivalError,
  onRetryArrivals,
}: DetailsPanelProps) {
  const [panelSize, setPanelSize] = useState<DetailsPanelSize>('default');

  return (
    <aside
      className={`${activeTab === 'details' ? 'flex' : 'hidden'} details-panel details-panel--${panelSize} lg:flex`}
      id="panel-details"
      role="tabpanel"
      aria-label="상세 패널"
    >
      {/* 패널 안의 콘텐츠 탭. 바깥에서 건드릴 일이 없어 비제어(defaultValue)로 둔다.
          정류장이 바뀌면 DashboardShell의 key remount로 이 탭이 기본값으로 초기화된다. */}
      <Tabs defaultValue="station-detail" className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 px-4 py-3 sm:px-5">
          <TabsList>
            <TabsTrigger value="station-detail">버스 상세</TabsTrigger>
            <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
          </TabsList>
          <PanelSizeControls panelSize={panelSize} onChange={setPanelSize} />
        </div>

        <TabsContent value="station-detail" className="flex min-h-0 flex-1 flex-col">
          {station ? (
            <>
              <DetailsPanelHeader station={station} updatedAt={arrivals[0]?.updatedAt} />
              <section className="hover-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-slate-200/70 p-4 sm:p-5 lg:px-5 lg:py-4">
                <ArrivalList
                  station={station}
                  arrivals={arrivals}
                  status={arrivalStatus}
                  error={arrivalError}
                  selectedRouteId={selectedRouteId}
                  isFavorite={isFavorite}
                  onToggleFavorite={onToggleFavorite}
                  onSelectRoute={onSelectRoute}
                  onRetry={onRetryArrivals}
                />
              </section>
            </>
          ) : (
            <EmptyStationState />
          )}
        </TabsContent>
        <TabsContent value="favorites" className="flex min-h-0 flex-1 flex-col">
          <FavoritesTab favorites={favorites} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}

function EmptyStationState() {
  return (
    <section className="grid min-h-0 flex-1 place-items-center p-6 text-center">
      <div className="max-w-sm rounded-2xl border border-dashed border-slate-300/80 bg-white/[0.55] p-8 shadow-sm shadow-slate-200/50">
        <h2 className="text-lg font-bold text-slate-800">정류장을 선택해 주세요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          지도에서 정류장 마커를 선택하거나 상단 검색창에서 정류장을 검색하면 도착정보를 확인할 수
          있습니다.
        </p>
      </div>
    </section>
  );
}
