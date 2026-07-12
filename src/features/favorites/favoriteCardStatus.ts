import type { FavoriteArrivalEntry } from './useFavoriteArrivals'

// 즐겨찾기 카드 하단 라벨 정책. 로딩·에러·무정보·정상 상태를 명확히 구분해 안내한다.
export function getFavoriteArrivalLabel({
  arrival,
  isLoading,
  isError,
}: FavoriteArrivalEntry): string {
  if (isError) return '도착정보를 불러오지 못했어요'
  if (!arrival) return isLoading ? '도착정보 확인 중…' : '운행 정보 없음'

  const remainingStops = arrival.first?.remainingStops
  if (remainingStops == null) return '위치 정보 없음'
  return remainingStops === 0 ? '정류장 도착' : `${remainingStops}정거장 전`
}
