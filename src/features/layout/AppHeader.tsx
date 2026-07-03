import { BellIcon, SearchIcon, UserIcon } from '../../shared/components/Icons'

export function AppHeader() {
  return (
    <header className="relative z-10 grid h-16 grid-cols-[auto_minmax(180px,1fr)_auto] items-center border-b border-slate-200 bg-white lg:h-20 lg:grid-cols-[var(--left-panel)_minmax(320px,1fr)_var(--right-panel)]">
      <a
        className="flex self-stretch items-center px-3.5 text-xl font-extrabold tracking-[-1.2px] text-blue-950 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-4.5 sm:text-[21px] lg:border-r lg:border-slate-200 lg:px-5.5 xl:px-7 xl:text-[26px]"
        href="#main-content"
        aria-label="Catch Bus 홈"
      >
        <span className="hidden sm:inline">Catch&nbsp;</span><span className="text-brand">Bus</span>
      </a>

      <div className="ml-1.5 flex h-10.5 w-[calc(100%-12px)] items-center gap-2.5 rounded-xl border border-slate-300 bg-white px-3 text-[13px] text-slate-400 shadow-[0_2px_8px_rgb(15_23_42/5%)] sm:ml-3 sm:w-[calc(100%-24px)] sm:px-4 sm:text-base lg:ml-6 lg:h-12 lg:w-[min(372px,calc(100%-48px))]" role="search">
        <SearchIcon />
        <span>정류장, 버스 검색</span>
      </div>

      <nav className="flex justify-end gap-2 px-2 lg:gap-4 lg:px-5 xl:gap-6 xl:px-7" aria-label="사용자 메뉴">
        <button className="hidden min-h-10 cursor-pointer items-center justify-center gap-2 bg-transparent text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:inline-flex sm:w-10 lg:w-auto" type="button" aria-label="알림">
          <BellIcon />
          <span className="hidden xl:inline">알림</span>
        </button>
        <button className="inline-flex min-h-10 w-10 cursor-pointer items-center justify-center gap-2 bg-transparent text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:w-auto" type="button" aria-label="내 계정">
          <UserIcon />
          <span className="hidden xl:inline">내 계정</span>
        </button>
      </nav>
    </header>
  )
}
