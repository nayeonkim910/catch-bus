import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';
import { ArrivalList } from './ArrivalList';
import { DetailsPanelHeader } from './DetailsPanelHeader';
import type { DetailsPanelTab } from './detailsPanelTypes';
import { FavoritesTab } from './FavoritesTab';
import type { ArrivalStatus } from './types';

type DetailsPanelContentProps = {
  selectedTab: DetailsPanelTab;
  station: BusStation | null;
  arrivals: BusArrival[];
  favorites: Favorite[];
  arrivalStatus: ArrivalStatus;
  arrivalError: string | null;
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  onRetryArrivals: () => void;
};

export function DetailsPanelContent({
  selectedTab,
  station,
  arrivals,
  favorites,
  arrivalStatus,
  arrivalError,
  isFavorite,
  onToggleFavorite,
  onRetryArrivals,
}: DetailsPanelContentProps) {
  if (selectedTab === 'favorites') {
    return <FavoritesTab favorites={favorites} />;
  }

  if (!station) {
    return <EmptyStationState />;
  }

  return (
    <>
      <DetailsPanelHeader station={station} updatedAt={arrivals[0]?.updatedAt} />
      <section className="hover-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-slate-200/70 p-4 sm:p-5 lg:px-5 lg:py-4">
        <ArrivalList
          station={station}
          arrivals={arrivals}
          status={arrivalStatus}
          error={arrivalError}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onRetry={onRetryArrivals}
        />
      </section>
    </>
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
