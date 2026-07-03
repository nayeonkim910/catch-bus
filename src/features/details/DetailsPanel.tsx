import { SectionHeading, SectionPlaceholder } from '../../shared/components/PanelSection'
import type { MobileTab } from '../../shared/types/navigation'

export function DetailsPanel({ activeTab }: { activeTab: MobileTab }) {
  return (
    <aside className={`${activeTab === 'details' ? 'flex' : 'hidden'} h-full min-h-0 min-w-0 flex-col overflow-y-auto bg-canvas lg:flex lg:border-l lg:border-slate-200`} aria-label="상세 패널">
      <section className="shrink-0 p-4 sm:p-5 lg:p-6 lg:px-5">
        <SectionHeading>정류장 상세</SectionHeading>
        <SectionPlaceholder className="min-h-30" label="선택 정류장 정보 영역" />
      </section>
      <section className="flex-1 border-t border-slate-200 p-4 sm:p-5 lg:p-6 lg:px-5">
        <SectionHeading>도착정보</SectionHeading>
        <SectionPlaceholder className="min-h-90" label="도착정보 목록 영역" />
      </section>
      <div className="mx-4 mb-4 shrink-0 rounded-[10px] border border-dashed border-slate-300 bg-white p-3.5 text-center text-[13px] text-slate-400 sm:mx-5 sm:mb-5">하단 액션 영역</div>
    </aside>
  )
}
