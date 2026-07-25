import { EmptyState } from '../../shared/components/EmptyState';
import { FavoriteCard } from '../favorites/FavoriteCard';
import { useFavoriteArrivals } from '../favorites/useFavoriteArrivals';
import { useFavorites } from '../favorites/useFavorites';

export function FavoritesTab() {
  const { favorites } = useFavorites(); // 즐겨찾기 목록을 store에서 직접 구독
  const arrivals = useFavoriteArrivals(favorites);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="즐겨찾기가 비어있어요"
        description="자주 타는 정류장과 버스를 저장하면 이 탭에서 빠르게 확인할 수 있습니다."
      />
    );
  }

  return (
    <section className="hover-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:px-5 lg:py-4">
      <div className="space-y-3">
        {favorites.map((favorite) => {
          const { arrival, isLoading, isError } = arrivals.getEntry(favorite);
          return (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              arrival={arrival}
              isLoading={isLoading}
              isError={isError}
            />
          );
        })}
      </div>
    </section>
  );
}
