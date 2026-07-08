export function calculateCurrentStationSequence(
  targetStationSequence: number,
  remainingStops: number | null,
): number | null {
  // staOrder는 도착 대상 정류장의 노선 순번이고 locationNo는 남은 정류장 수다.
  // 둘 중 하나가 유효하지 않으면 잘못된 위치를 노출하지 않고 null을 반환한다.
  if (
    !Number.isInteger(targetStationSequence) ||
    remainingStops === null ||
    !Number.isInteger(remainingStops) ||
    remainingStops < 0
  ) {
    return null;
  }

  const currentStationSequence = targetStationSequence - remainingStops;
  return currentStationSequence > 0 ? currentStationSequence : null;
}
