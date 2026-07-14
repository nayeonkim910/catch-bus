import type { DetailsPanelTab } from './detailsPanelTypes';

const detailsPanelTabs = [
  { id: 'station-detail', label: '버스 상세' },
  { id: 'favorites', label: '즐겨찾기' },
] satisfies { id: DetailsPanelTab; label: string }[];

type DetailsPanelTabsProps = {
  selectedTab: DetailsPanelTab;
  onSelect: (tab: DetailsPanelTab) => void;
};

export function DetailsPanelTabs({ selectedTab, onSelect }: DetailsPanelTabsProps) {
  return (
    <div
      className="flex min-w-0 shrink gap-1 rounded-full bg-slate-100 p-1"
      role="tablist"
      aria-label="하단 패널 탭"
    >
      {detailsPanelTabs.map((tab) => (
        <button
          className={`min-w-0 rounded-full px-3 py-2 text-xs font-bold transition-colors sm:px-4 sm:text-sm ${selectedTab === tab.id ? 'bg-white text-brand shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'}`}
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={selectedTab === tab.id}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
