import { User } from 'lucide-react';
import { Button } from '@shared/components/ui/Button';
import { StationSearch } from '@features/search/StationSearch';
import { LoginDialog } from '@features/auth/LoginDialog';
import { useSelectionStore } from '@features/selection/selectionStore';

export function AppHeader() {
  const selectStation = useSelectionStore((state) => state.selectStation);
  return (
    <header className="relative z-40 flex h-(--header-h) justify-between gap-2 border-b-2 border-blue-200 p-2 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:block lg:h-0 lg:border-0 lg:p-0">
      <div className="flex lg:contents">
        <a
          className="flex self-stretch items-center px-3.5 text-xl font-extrabold tracking-[-1.2px] text-blue-950 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4.5 sm:text-[21px] lg:hidden"
          href="#panel-map"
          aria-label="Catch Bus 홈"
        >
          <span className="hidden sm:inline">Catch&nbsp;</span>
          <span className="text-primary">Bus</span>
        </a>

        <StationSearch onSelect={selectStation} floating />
      </div>

      <nav
        className="flex justify-end gap-2 px-2 lg:pointer-events-auto lg:absolute lg:top-4 lg:right-4 lg:h-12 lg:items-center lg:gap-3 lg:rounded-xl lg:bg-white lg:px-3 lg:shadow-lg"
        aria-label="사용자 메뉴"
      >
        <LoginDialog>
          <Button variant="tertiary" size="icon" aria-label="내 계정">
            <User className="size-5 shrink-0" />
          </Button>
        </LoginDialog>
      </nav>
    </header>
  );
}
