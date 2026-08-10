import type { BusStation } from '@shared/types/bus';

type StationSearchResultsProps = {
  isLoading: boolean;
  isError: boolean;
  stations: BusStation[];
  onSelect: (station: BusStation) => void;
};

const MAX_VISIBLE_RESULTS = 12;
const SEARCH_FAILED_MESSAGE = '정류장을 검색하지 못했어요. 잠시 후 다시 시도해 주세요.';

function LoadingResults() {
  return (
    <div className="space-y-2 px-1 py-1" aria-live="polite">
      <p className="sr-only">정류장을 찾고 있어요.</p>
      {[0, 1, 2].map((item) => (
        <div className="h-14 animate-pulse rounded-lg bg-muted" key={item} />
      ))}
    </div>
  );
}

export function StationSearchResults({
  isLoading,
  isError,
  stations,
  onSelect,
}: StationSearchResultsProps) {
  if (isLoading) {
    return <LoadingResults />;
  }

  if (isError) {
    return (
      <p className="px-3 py-5 text-center text-sm text-danger" role="alert">
        {SEARCH_FAILED_MESSAGE}
      </p>
    );
  }

  if (stations.length === 0) {
    return (
      <p className="px-3 py-5 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</p>
    );
  }

  const visibleStations = stations.slice(0, MAX_VISIBLE_RESULTS);

  return (
    <>
      {stations.length > MAX_VISIBLE_RESULTS && (
        <p className="px-3 pb-2 pt-1 text-xs text-muted-foreground">
          전체 {stations.length}개 중 {MAX_VISIBLE_RESULTS}개를 표시합니다.
        </p>
      )}
      <ul className="space-y-0.5">
        {visibleStations.map((station) => (
          <li key={station.id}>
            <button
              className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
              onClick={() => onSelect(station)}
              type="button"
            >
              <span className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-foreground">
                  {station.name}
                </strong>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {station.regionName}
                  {station.isCenterLane ? ' · 중앙차로' : ''}
                </span>
              </span>
              {station.mobileNo && (
                <span className="shrink-0 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-primary">
                  {station.mobileNo}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
