import { useState } from 'react';
import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';
import type { MobileTab } from '../../shared/types/navigation';
import { DetailsPanelContent } from './DetailsPanelContent';
import { DetailsPanelTabs } from './DetailsPanelTabs';
import type { DetailsPanelSize, DetailsPanelTab } from './detailsPanelTypes';
import { PanelSizeControls } from './PanelSizeControls';
import type { ArrivalStatus } from './types';

type DetailsPanelProps = {
  activeTab: MobileTab;
  station: BusStation | null;
  arrivals: BusArrival[];
  favorites: Favorite[];
  isFavorite: (stationId: string, routeId: string) => boolean;
  onToggleFavorite: (station: BusStation, arrival: BusArrival) => void;
  arrivalStatus: ArrivalStatus;
  arrivalError: string | null;
  onRetryArrivals: () => void;
};

export function DetailsPanel({
  activeTab,
  station,
  arrivals,
  favorites,
  isFavorite,
  onToggleFavorite,
  arrivalStatus,
  arrivalError,
  onRetryArrivals,
}: DetailsPanelProps) {
  const [panelSize, setPanelSize] = useState<DetailsPanelSize>('default');
  const [selectedTab, setSelectedTab] = useState<DetailsPanelTab>('station-detail');

  return (
    <aside
      className={`${activeTab === 'details' ? 'flex' : 'hidden'} details-panel details-panel--${panelSize} lg:flex`}
      id="panel-details"
      role="tabpanel"
      aria-label="상세 패널"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 px-4 py-3 sm:px-5">
        <DetailsPanelTabs selectedTab={selectedTab} onSelect={setSelectedTab} />
        <PanelSizeControls panelSize={panelSize} onChange={setPanelSize} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <DetailsPanelContent
          selectedTab={selectedTab}
          station={station}
          arrivals={arrivals}
          favorites={favorites}
          arrivalStatus={arrivalStatus}
          arrivalError={arrivalError}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          onRetryArrivals={onRetryArrivals}
        />
      </div>
    </aside>
  );
}
