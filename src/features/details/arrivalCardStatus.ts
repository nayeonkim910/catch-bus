type ArrivalCardStatus = {
  label: string;
  className: string;
  cardClassName: string;
};

// 도착 초 기준의 UI 강조 정책이다. 실제 탑승 가능성 판단은 도보 시간이 필요하므로 여기서 처리하지 않는다.
export function getArrivalCardStatus(seconds: number | null): ArrivalCardStatus {
  if (seconds === null) {
    return {
      label: '정보 확인 필요',
      className: 'bg-slate-100 text-slate-600',
      cardClassName: 'border-slate-300 hover:border-blue-700 hover:bg-blue-50',
    };
  }

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
