import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BusArrival, BusStation, Favorite } from '@shared/types/bus';
import { createFavorite, getFavoriteId } from './favorite';

type FavoritesStore = {
  favorites: Favorite[];
  toggle: (station: BusStation, arrival: BusArrival) => void;
};

// 게스트(비로그인) 즐겨찾기를 localStorage에 영속화한다.
// persist가 저장/로드/버전을 전담하므로 이 파일에서 localStorage를 직접 만지지 않는다.
// isFavorite 판정은 스토어에 두지 않는다. useFavorites가 구독한 favorites 배열에서 파생한다.
// (스토어 메서드로 두면 안정 함수 참조라 favorites가 바뀌어도 소비처 리렌더가 안 걸린다.)
export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (station, arrival) => {
        const id = getFavoriteId(station.id, arrival.routeId);
        const { favorites } = get();
        set({
          favorites: favorites.some((favorite) => favorite.id === id)
            ? favorites.filter((favorite) => favorite.id !== id)
            : [...favorites, createFavorite(station, arrival)],
        });
      },
      // 로그인 확장 시 추가할 것: clear() — 게스트 목록을 서버로 병합한 뒤 localStorage를 비울 때 쓴다.
      // 지금은 호출부(merge 로직)가 없어 미리 두지 않는다.
      //   clear: () => set({ favorites: [] }),
    }),
    {
      name: 'catch-bus:favorites',
      version: 1,
      // 함수는 저장할 필요가 없으므로 favorites만 영속화한다.
      partialize: (state) => ({ favorites: state.favorites }),
      // 스키마를 바꿔 version을 올릴 때 추가할 것: migrate: (persisted, from) => ...
      // 옛 버전 데이터를 새 구조로 변환한다. 지금은 v1이라 변환할 이전 버전이 없어 두지 않는다.
    },
  ),
);
