import { Star } from 'lucide-react';
import { Button } from '@shared/components/ui/Button';
import { EmptyState } from '@shared/components/ui/EmptyState';
import type { BusArrival, Favorite } from '@shared/types/bus';
import { RouteBadge } from '@features/routes/RouteBadge';
import { getFavoriteStatusLabel } from '@features/favorites/favoriteCardStatus';
import { useFavoriteArrivals } from '@features/favorites/useFavoriteArrivals';
import { useFavorites } from '@features/favorites/useFavorites';
import { ArrivalCard } from './ArrivalCard';

type FavoritesTabProps = {
  selectedRouteId: string | null;
  onSelectRoute: (arrival: BusArrival) => void;
};

function arrivalRank(arrival?: BusArrival) {
  return arrival?.first?.arrivalSeconds ?? Number.POSITIVE_INFINITY;
}

export function FavoritesTab({ selectedRouteId, onSelectRoute }: FavoritesTabProps) {
  const { favorites } = useFavorites();
  const arrivals = useFavoriteArrivals(favorites);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="즐겨찾기가 비어있어요"
        description="자주 타는 정류장과 버스를 저장하면 이 탭에서 빠르게 확인할 수 있습니다."
      />
    );
  }

  const rows = favorites
    .map((favorite) => ({ favorite, ...arrivals.getEntry(favorite) }))
    .sort((a, b) => arrivalRank(a.arrival) - arrivalRank(b.arrival));

  return (
    <section className="hover-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:px-5 lg:py-4">
      <div className="space-y-3">
        {rows.map(({ favorite, arrival, isLoading, isError }) =>
          arrival ? (
            <ArrivalCard
              key={favorite.id}
              station={{ id: favorite.stationId, name: favorite.stationName }}
              arrival={arrival}
              stationLabel={favorite.stationName}
              isRouteSelected={arrival.routeId === selectedRouteId}
              onSelectRoute={() => onSelectRoute(arrival)}
            />
          ) : (
            <NoArrivalFavoriteCard
              key={favorite.id}
              favorite={favorite}
              isLoading={isLoading}
              isError={isError}
            />
          ),
        )}
      </div>
    </section>
  );
}

type NoArrivalFavoriteCardProps = {
  favorite: Favorite;
  isLoading: boolean;
  isError: boolean;
};

// 도착 응답이 없는(로딩·실패·응답 누락) 즐겨찾기의 폴백. ArrivalCard는 arrival 없이는 못 그린다.
function NoArrivalFavoriteCard({ favorite, isLoading, isError }: NoArrivalFavoriteCardProps) {
  const { remove } = useFavorites(); // arrival이 없어 toggle 불가 -> id로 삭제한다.

  return (
    <div className="flex min-h-36 flex-col rounded-xl border-2 border-border bg-card p-4 opacity-90 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <RouteBadge routeName={favorite.routeName} routeTypeCode={favorite.routeTypeCode} />
          <span className="truncate text-sm font-semibold text-foreground">
            {favorite.destinationName} 방면
          </span>
        </div>
        <Button
          variant="primary"
          size="icon"
          className="size-8 shrink-0"
          aria-label={`${favorite.routeName}번 즐겨찾기 삭제`}
          onClick={() => remove(favorite.id)}
        >
          <Star className="size-5 shrink-0" fill="currentColor" />
        </Button>
      </div>
      <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
        {favorite.stationName}
      </p>
      <p className="mt-auto text-xs text-muted-foreground">
        {getFavoriteStatusLabel({ isLoading, isError })}
      </p>
    </div>
  );
}
