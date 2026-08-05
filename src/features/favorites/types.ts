import type { BusArrival, BusStation, Favorite } from '@shared/types/bus';

// useFavorites가 반환하는 계약. 게스트(localStorage)든 로그인(서버)이든 이 형태를 유지한다.
// 소비 컴포넌트는 이 계약만 알고, 저장 위치, 로그인 여부는 useFavorites 훅 내부에만 존재한다.
export type FavoritesApi = {
  favorites: Favorite[];
  isFavorite: (stationId: string, routeId: string) => boolean;
  toggle: (station: BusStation, arrival: BusArrival) => void;
  remove: (id: string) => void;
};
