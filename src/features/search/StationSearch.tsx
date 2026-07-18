import { useEffect, useRef, type FormEvent } from 'react';
import { SearchIcon } from '../../shared/components/Icons';
import { Button } from '../../shared/components/ui/Button';
import type { BusStation } from '../../shared/types/bus';
import { StationSearchResults } from './StationSearchResults';
import { useStationSearch } from './useStationSearch';

type StationSearchProps = {
  onSelect: (station: BusStation) => void;
  floating?: boolean;
};

const baseSearchContainerClassName =
  'relative ml-1.5 w-[calc(100%-12px)] sm:ml-3 sm:w-[calc(100%-24px)]';

const floatingSearchContainerClassName =
  'lg:pointer-events-auto lg:absolute lg:top-4 lg:left-[clamp(13.5rem,24vw,24rem)] lg:ml-0 lg:w-[min(440px,calc(100vw-34rem))]';

const inlineSearchContainerClassName = 'lg:ml-6 lg:w-[min(420px,calc(100%-48px))]';

export function StationSearch({ onSelect, floating = false }: StationSearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { query, searchState, setQuery, submitSearch, resetResults } = useStationSearch();
  const isOpen = searchState.status !== 'idle';

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        resetResults();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, resetResults]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitSearch();
  }

  function handleSelect(station: BusStation) {
    setQuery(station.name);
    onSelect(station);
  }

  return (
    <div
      className={`${baseSearchContainerClassName} ${floating ? floatingSearchContainerClassName : inlineSearchContainerClassName}`}
      ref={containerRef}
    >
      <form
        className="flex h-10.5 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-slate-700 shadow-[0_2px_8px_rgb(15_23_42/5%)] focus-within:border-brand focus-within:ring-2 focus-within:ring-blue-100 sm:h-11 sm:px-4 lg:h-12"
        onSubmit={handleSubmit}
        role="search"
      >
        <SearchIcon />
        <input
          aria-controls={isOpen ? 'station-search-results' : undefined}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') resetResults();
          }}
          placeholder="정류장 검색"
          type="search"
          value={query}
        />
        <Button
          variant="primary"
          size="sm"
          className="shrink-0"
          disabled={searchState.status === 'loading'}
          type="submit"
        >
          {searchState.status === 'loading' ? '검색 중' : '검색'}
        </Button>
      </form>

      {isOpen && (
        <div
          className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[min(420px,60vh)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
          id="station-search-results"
        >
          <StationSearchResults searchState={searchState} onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}
