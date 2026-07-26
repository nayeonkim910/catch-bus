import { useCallback } from 'react';
import { getFavoriteId } from './favorite';
import { useFavoritesStore } from './favoritesStore';
import type { FavoritesApi } from './types';

export function useFavorites(): FavoritesApi {
  // 지금은 게스트(localStorage)만 존재한다. 로그인이 붙으면 여기서만 분기하고,
  // 소비 컴포넌트는 저장 위치를 모른 채 FavoritesApi 계약만 쓴다.
  //
  // TODO(로그인 확장): 아래 형태로 분기한다.
  //   const isLoggedIn = useAuth();
  //   return isLoggedIn ? useServerFavorites() : useGuestFavorites();
  //
  //   [useServerFavorites — 나중 구현] 반환 타입은 동일하게 FavoritesApi
  //   - useQuery(favoritesQueryOptions)로 서버 목록 조회
  //   - toggle은 useMutation + 낙관적 업데이트
  //       onMutate: cancelQueries → 이전 값 백업 → setQueryData로 즉시 반영
  //       onError: 백업으로 롤백 / onSettled: invalidateQueries
  //
  //   [로그인 시 게스트→서버 병합 — 나중 구현]
  //   - 게스트 목록 읽기(빈 배열이면 종료) → 서버 목록과 id 기준 dedup
  //     → 서버에 없는 것만 upsert → 업로드 성공 확인 후에만 게스트 store를 clear
  //     (순서를 어기면 데이터가 증발한다)
  return useGuestFavorites();
}

function useGuestFavorites(): FavoritesApi {
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggle = useFavoritesStore((state) => state.toggle);

  // isFavorite는 구독한 favorites 배열에서 파생한다. store 메서드로 두면 안정 함수 참조라
  // favorites가 바뀌어도 소비처 리렌더가 안 걸린다(별표가 갱신되지 않음).
  const isFavorite = useCallback(
    (stationId: string, routeId: string) =>
      favorites.some((favorite) => favorite.id === getFavoriteId(stationId, routeId)),
    [favorites],
  );

  return { favorites, isFavorite, toggle };
}
