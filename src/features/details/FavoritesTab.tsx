import type { Favorite } from '../../shared/types/bus';
import { FavoriteCard } from '../favorites/FavoriteCard';
import { useFavoriteArrivals } from '../favorites/useFavoriteArrivals';

type FavoritesTabProps = {
  favorites: Favorite[];
};

export function FavoritesTab({ favorites }: FavoritesTabProps) {
  const arrivals = useFavoriteArrivals(favorites);

  return (
    <section className="hover-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:px-5 lg:py-4">
      {favorites.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
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
      ) : (
        <EmptyFavorites />
      )}
    </section>
  );
}

function EmptyFavorites() {
  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
      <p className="text-base font-bold text-slate-800">즐겨찾기가 비어있어요</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        자주 타는 정류장과 버스를 저장하면 이 탭에서 빠르게 확인할 수 있습니다.
      </p>
    </div>
  );
}
