import { SectionHeading, SectionPlaceholder } from '../../shared/components/PanelSection'
import type { MobileTab } from '../../shared/types/navigation'

export function FavoritesPanel({ activeTab }: { activeTab: MobileTab }) {
  return (
    <aside className={`${activeTab === 'favorites' ? 'flex' : 'hidden'} h-full min-h-0 min-w-0 flex-col overflow-y-auto bg-canvas lg:flex lg:border-r lg:border-slate-200`} aria-label="즐겨찾기 패널">
      <section className="min-h-[58%] p-4 sm:p-5 lg:p-6 lg:px-5">
        <SectionHeading action="편집">즐겨찾기</SectionHeading>
        <SectionPlaceholder className="min-h-80" label="즐겨찾기 목록 영역" />
      </section>
      <section className="border-t border-slate-200 p-4 sm:p-5 lg:p-6 lg:px-5">
        <SectionHeading>최근 검색</SectionHeading>
        <SectionPlaceholder label="최근 검색 영역" />
      </section>
    </aside>
  )
}
