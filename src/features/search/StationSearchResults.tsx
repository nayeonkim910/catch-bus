import type { BusStation } from '../../shared/types/bus'
import type { StationSearchState } from './useStationSearch'

type StationSearchResultsProps = {
  searchState: Exclude<StationSearchState, { status: 'idle' }>
  onSelect: (station: BusStation) => void
}

const MAX_VISIBLE_RESULTS = 12

function LoadingResults() {
  return (
    <div className="space-y-2 px-1 py-1" aria-live="polite">
      <p className="sr-only">정류장을 찾고 있어요.</p>
      {[0, 1, 2].map((item) => (
        <div className="h-14 animate-pulse rounded-lg bg-slate-100" key={item} />
      ))}
    </div>
  )
}

export function StationSearchResults({ searchState, onSelect }: StationSearchResultsProps) {
  if (searchState.status === 'loading') {
    return <LoadingResults />
  }

  if (searchState.status === 'error') {
    return <p className="px-3 py-5 text-center text-sm text-red-600" role="alert">{searchState.message}</p>
  }

  if (searchState.stations.length === 0) {
    return <p className="px-3 py-5 text-center text-sm text-slate-500">검색 결과가 없습니다.</p>
  }

  const visibleStations = searchState.stations.slice(0, MAX_VISIBLE_RESULTS)

  return (
    <>
      {searchState.stations.length > MAX_VISIBLE_RESULTS && (
        <p className="px-3 pb-2 pt-1 text-xs text-slate-400">
          전체 {searchState.stations.length}개 중 {MAX_VISIBLE_RESULTS}개를 표시합니다.
        </p>
      )}
      <ul className="space-y-0.5">
        {visibleStations.map((station) => (
          <li key={station.id}>
            <button
              className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand"
              onClick={() => onSelect(station)}
              type="button"
            >
              <span className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-slate-900">{station.name}</strong>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {station.regionName}{station.isCenterLane ? ' · 중앙차로' : ''}
                </span>
              </span>
              {station.mobileNo && (
                <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-brand">
                  {station.mobileNo}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
