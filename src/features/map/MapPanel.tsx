import type { MobileTab } from '../../shared/types/navigation'

export function MapPanel({ activeTab }: { activeTab: MobileTab }) {
  return (
    <main className={`${activeTab === 'map' ? 'block' : 'hidden'} relative h-full min-h-0 min-w-0 overflow-hidden bg-slate-100 lg:block`} id="main-content">
      <div className="h-full w-full bg-[linear-gradient(115deg,transparent_48%,rgb(255_255_255/65%)_49%,rgb(255_255_255/65%)_51%,transparent_52%),linear-gradient(25deg,transparent_44%,rgb(255_255_255/45%)_45%,rgb(255_255_255/45%)_47%,transparent_48%)] bg-[#edf2f4]">
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-slate-500">
          <strong className="text-lg text-slate-700">지도 영역</strong>
          <span className="text-sm">Kakao Map 연결 예정</span>
        </div>
      </div>
      <div className="absolute bottom-20 right-5 rounded-[10px] border border-dashed border-slate-300 bg-white/90 px-2.5 py-8 text-xs text-slate-400 [writing-mode:vertical-rl]" aria-hidden="true">지도 컨트롤</div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-[10px] border border-dashed border-slate-300 bg-white/90 px-8 py-2.5 text-xs text-slate-400" aria-hidden="true">지도 범례</div>
    </main>
  )
}
