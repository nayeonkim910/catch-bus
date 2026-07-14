import { useCallback, useState } from 'react';
import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';
import { createFavorite, getFavoriteId } from './favorite';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const isFavorite = useCallback(
    (stationId: string, routeId: string) =>
      favorites.some((favorite) => favorite.id === getFavoriteId(stationId, routeId)),
    [favorites],
  );

  const toggleFavorite = useCallback((station: BusStation, arrival: BusArrival) => {
    const id = getFavoriteId(station.id, arrival.routeId);

    setFavorites((current) => {
      const exists = current.some((favorite) => favorite.id === id);
      return exists
        ? current.filter((favorite) => favorite.id !== id)
        : [...current, createFavorite(station, arrival)];
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
