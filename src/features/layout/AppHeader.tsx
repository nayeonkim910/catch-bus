import { BellIcon, UserIcon } from '../../shared/components/Icons'
import type { BusStation } from '../../shared/types/bus'
import { StationSearch } from '../search/StationSearch'

type AppHeaderProps = {
  onStationSelect: (station: BusStation) => void
}

export function AppHeader({ onStationSelect }: AppHeaderProps) {
  return (
    <header className="relative z-40 flex h-16 justify-between gap-2 border-b-2 border-blue-200 p-2 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:block lg:h-0 lg:border-0 lg:p-0">
      <div className="flex lg:contents">
        <a
          className="flex self-stretch items-center px-3.5 text-xl font-extrabold tracking-[-1.2px] text-blue-950 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-4.5 sm:text-[21px] lg:pointer-events-auto lg:absolute lg:top-4 lg:left-4 lg:h-12 lg:self-auto lg:rounded-xl lg:bg-white lg:px-5 lg:shadow-lg xl:text-[24px]"
          href="#panel-map"
          aria-label="Catch Bus 홈"
        >
          <span className="hidden sm:inline">Catch&nbsp;</span>
          <span className="text-brand">Bus</span>
        </a>

        <StationSearch onSelect={onStationSelect} floating />
      </div>

      <nav
        className="flex justify-end gap-2 px-2 lg:pointer-events-auto lg:absolute lg:top-4 lg:right-4 lg:h-12 lg:items-center lg:gap-3 lg:rounded-xl lg:bg-white lg:px-3 lg:shadow-lg"
        aria-label="사용자 메뉴"
      >
        <button
          className="hidden min-h-10 cursor-pointer items-center justify-center gap-2 bg-transparent text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:inline-flex sm:w-10 lg:w-auto"
          type="button"
          aria-label="알림"
        >
          <BellIcon />
          <span className="hidden xl:inline">알림</span>
        </button>
        <button
          className="inline-flex min-h-10 w-10 cursor-pointer items-center justify-center gap-2 bg-transparent text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:w-auto"
          type="button"
          aria-label="내 계정"
        >
          <UserIcon />
          <span className="hidden xl:inline">내 계정</span>
        </button>
      </nav>
    </header>
  )
}
