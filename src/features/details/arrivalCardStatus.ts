// 긴급도는 배지가 아니라 도착 숫자의 '색'으로만 표시한다.
// 실제 탑승 가능성 판단은 도보 시간이 필요하므로 여기서 처리하지 않는다.
const IMMINENT_SECONDS = 180;

export function isArrivalImminent(seconds: number) {
  return seconds <= IMMINENT_SECONDS;
}

/**
 * 도착 예정 시간이 없을 때, 운행 상태(경기 API flag)로 문구를 구분한다.
 * flag: RUN/PASS(운행중) · STOP(운행종료) · WAIT(회차지대기).
 * 운행 중(RUN/PASS)이면 "곧 올 버스가 없는" 것뿐이라 정보 없음으로, 나머지는 상태를 명시한다.
 */
export function getNoArrivalLabel(status: string): string {
  if (status === 'STOP') return '운행 종료';
  if (status === 'WAIT') return '회차지 대기';
  return '도착 예정 정보 없음';
}
