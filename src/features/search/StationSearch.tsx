import { useRef, useState, type FormEvent } from 'react'
import { searchStations } from '../../lib/busApi'
import { SearchIcon } from '../../shared/components/Icons'
import type { BusStation } from '../../shared/types/bus'

type SearchState =
  | { status: 'idle'; stations: BusStation[]; message: null }
  | { status: 'loading'; stations: BusStation[]; message: null }
  | { status: 'success'; stations: BusStation[]; message: null }
  | { status: 'error'; stations: BusStation[]; message: string }

type StationSearchProps = {
  onSelect: (station: BusStation) => void
}

const initialState: SearchState = { status: 'idle', stations: [], message: null }

export function StationSearch({ onSelect }: StationSearchProps) {
  const [query, setQuery] = useState('')
  const [searchState, setSearchState] = useState<SearchState>(initialState)
  const abortControllerRef = useRef<AbortController | null>(null)

  const isOpen = searchState.status !== 'idle'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSearchState({ status: 'error', stations: [], message: '검색어를 입력해 주세요.' })
      return
    }

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    setSearchState({ status: 'loading', stations: [], message: null })

    try {
      const result = await searchStations(trimmedQuery, controller.signal)
      setSearchState({ status: 'success', stations: result.data.stations, message: null })
    } catch (error) {
      if (controller.signal.aborted) return

      setSearchState({
        status: 'error',
        stations: [],
        message: error instanceof Error ? error.message : '정류장 검색에 실패했습니다.',
      })
    }
  }

  function handleSelect(station: BusStation) {
    setQuery(station.name)
    setSearchState(initialState)
    onSelect(station)
  }

  return (
    <div className="relative ml-1.5 w-[calc(100%-12px)] sm:ml-3 sm:w-[calc(100%-24px)] lg:ml-6 lg:w-[min(420px,calc(100%-48px))]">
      <form
        className="flex h-10.5 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-slate-700 shadow-[0_2px_8px_rgb(15_23_42/5%)] focus-within:border-brand focus-within:ring-2 focus-within:ring-blue-100 sm:h-11 sm:px-4 lg:h-12"
        onSubmit={handleSubmit}
        role="search"
      >
        <SearchIcon />
        <input
          aria-autocomplete="list"
          aria-controls="station-search-results"
          aria-expanded={isOpen}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
          onChange={(event) => {
            setQuery(event.target.value)
            if (searchState.status !== 'idle') setSearchState(initialState)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setSearchState(initialState)
          }}
          placeholder="정류장 검색"
          type="search"
          value={query}
        />
        <button
          className="shrink-0 cursor-pointer rounded-md bg-brand px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:bg-blue-300 sm:px-3 sm:text-sm"
          disabled={searchState.status === 'loading'}
          type="submit"
        >
          {searchState.status === 'loading' ? '검색 중' : '검색'}
        </button>
      </form>

      {isOpen && (
        <div
          className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-[min(420px,60vh)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
          id="station-search-results"
          role="listbox"
        >
          {searchState.status === 'loading' && (
            <p className="px-3 py-5 text-center text-sm text-slate-500">정류장을 검색하고 있습니다.</p>
          )}

          {searchState.status === 'error' && (
            <p className="px-3 py-5 text-center text-sm text-red-600" role="alert">{searchState.message}</p>
          )}

          {searchState.status === 'success' && searchState.stations.length === 0 && (
            <p className="px-3 py-5 text-center text-sm text-slate-500">검색 결과가 없습니다.</p>
          )}

          {searchState.status === 'success' && searchState.stations.slice(0, 12).map((station) => (
            <button
              className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand"
              key={station.id}
              onClick={() => handleSelect(station)}
              role="option"
              type="button"
            >
              <span className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-slate-900">{station.name}</strong>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{station.regionName}{station.isCenterLane ? ' · 중앙차로' : ''}</span>
              </span>
              {station.mobileNo && <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-brand">{station.mobileNo}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
