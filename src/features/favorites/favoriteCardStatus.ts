import type { FavoriteArrivalEntry } from './useFavoriteArrivals';

// 도착 응답이 없는 즐겨찾기의 상태 문구. '운행 종료'라 단정하지 않는다(응답에 없을 뿐, 모르는 건 모른다고).
export function getFavoriteStatusLabel({
  isLoading,
  isError,
}: Pick<FavoriteArrivalEntry, 'isLoading' | 'isError'>): string {
  if (isError) return '도착정보를 불러오지 못했어요';
  return isLoading ? '도착정보 확인 중…' : '운행 정보 없음';
}
