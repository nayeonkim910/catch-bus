import { SectionHeading } from '../../shared/components/PanelSection'
import type { BusArrival, Favorite } from '../../shared/types/bus'
import type { MobileTab } from '../../shared/types/navigation'
import { FavoriteCard } from './FavoriteCard'

type FavoritesPanelProps = {
  activeTab: MobileTab
  favorites: Favorite[]
  arrivals: BusArrival[]
}

export function FavoritesPanel({ activeTab, favorites, arrivals }: FavoritesPanelProps) {
  return (
    <aside className={`${activeTab === 'favorites' ? 'flex' : 'hidden'} h-full min-h-0 min-w-0 flex-col overflow-hidden bg-canvas lg:flex lg:border-r lg:border-slate-200`} id="panel-favorites" role="tabpanel" aria-label="즐겨찾기 패널">
      <section className="flex min-h-0 flex-1 flex-col p-4 sm:p-5 lg:px-5 lg:pt-24 lg:pb-6">
        <div className="shrink-0">
          <SectionHeading>즐겨찾기</SectionHeading>
        </div>
        <div className="hover-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {favorites.length > 0 ? (
            <div className="space-y-3 pb-1">
              {favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  arrival={arrivals.find((arrival) => arrival.stationId === favorite.stationId && arrival.routeId === favorite.routeId)}
                />
              ))}
            </div>
          ) : (
            <div className="grid h-full min-h-56 place-items-center rounded-xl border border-dashed border-slate-300 bg-white/65 p-8 text-center">
              <div>
                <p className="font-semibold text-slate-700">즐겨찾기가 비어있어요</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">정류장 상세에서 자주 타는 버스의 별표를 눌러 추가해 보세요.</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="shrink-0 border-t border-slate-200 bg-canvas p-4 sm:p-5 lg:p-6 lg:px-5">
        <SectionHeading>최근 검색</SectionHeading>
        <p className="py-5 text-center text-sm text-slate-400">최근 검색 내역이 없습니다.</p>
      </section>
    </aside>
  )
}
