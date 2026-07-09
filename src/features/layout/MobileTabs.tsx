import type { MobileTab } from '../../shared/types/navigation'

const tabs: { id: MobileTab; label: string }[] = [
  { id: 'map', label: '지도' },
  { id: 'details', label: '상세' },
]

type MobileTabsProps = {
  activeTab: MobileTab
  onChange: (tab: MobileTab) => void
}

export function MobileTabs({ activeTab, onChange }: MobileTabsProps) {
  return (
    <div className="grid h-13 grid-cols-2 border-b border-slate-200 bg-white lg:hidden" role="tablist" aria-label="메인 화면">
      {tabs.map((tab) => (
        <button
          className={`relative cursor-pointer bg-transparent text-slate-500 after:absolute after:right-[22%] after:bottom-0 after:left-[22%] after:h-0.5 after:bg-brand ${activeTab === tab.id ? 'font-bold text-brand after:content-[""]' : ''}`}
          key={tab.id}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-controls={`panel-${tab.id}`}
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
