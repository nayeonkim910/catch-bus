import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BusArrival, BusStation, Favorite } from '@shared/types/bus';
import { createFavorite, getFavoriteId } from './favorite';

type FavoritesStore = {
  favorites: Favorite[];
  add: (station: BusStation, arrival: BusArrival) => void;
  remove: (id: string) => void;
};

// 게스트(비로그인) 즐겨찾기를 localStorage에 영속화한다.
// persist가 저장/로드/버전을 전담하므로 이 파일에서 localStorage를 직접 만지지 않는다.
export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],
      add: (station, arrival) =>
        set((state) => {
          const id = getFavoriteId(station.id, arrival.routeId);
          return state.favorites.some((favorite) => favorite.id === id)
            ? state
            : { favorites: [...state.favorites, createFavorite(station, arrival)] };
        }),
      remove: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((favorite) => favorite.id !== id),
        })),
      // 로그인 확장 시 추가할 것: clear() - 게스트 목록을 서버로 병합한 뒤 localStorage를 비울 때 쓴다.
      // 지금은 호출부(merge 로직)가 없어 미리 두지 않는다.
      //   clear: () => set({ favorites: [] }),
    }),
    {
      name: 'catch-bus:favorites',
      // v2 (2026-07-30): Favorite에 station 스냅샷(BusStation) 추가, stationId·stationName 평면 필드 제거.
      version: 2,
      // 함수는 저장할 필요가 없으므로 favorites만 영속화한다.
      partialize: (state) => ({ favorites: state.favorites }),
      // v1 데이터엔 station 스냅샷이 없어 변환이 불가능하다(좌표를 만들 수 없음). 비우고 재저장을 유도한다.
      migrate: (persisted, version) =>
        version < 2 ? { favorites: [] } : (persisted as { favorites: Favorite[] }),
    },
  ),
);
