export type ArrivalCardStatus = {
  label: string;
  className: string;
  cardClassName: string;
};

// 도착 초 기준의 UI 강조 정책이다. 실제 탑승 가능성 판단은 도보 시간이 필요하므로 여기서 처리하지 않는다.
// 도착 예정 시간이 없는 경우(seconds null)는 카드에서 별도로 "도착 예정 정보 없음"으로 처리한다.
export function getArrivalCardStatus(seconds: number): ArrivalCardStatus {
  if (seconds <= 180) {
    return {
      label: '곧 도착',
      className: 'bg-red-50 text-red-700',
      cardClassName: 'border-red-300 bg-red-50/45 hover:border-red-500 hover:bg-red-50',
    };
  }

  if (seconds <= 600) {
    return {
      label: '도착 임박',
      className: 'bg-amber-50 text-amber-700',
      cardClassName: 'border-amber-300 bg-amber-50/35 hover:border-amber-500 hover:bg-amber-50',
    };
  }

  return {
    label: '여유 있음',
    className: 'bg-blue-50 text-blue-700',
    cardClassName: 'border-slate-300 hover:border-blue-700 hover:bg-blue-50',
  };
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
