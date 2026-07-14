export function formatArrivalTime(seconds: number | null) {
  if (seconds === null) return '정보 없음';
  if (seconds < 60) return '곧 도착';
  return `${Math.ceil(seconds / 60)}분 후`;
}

export function formatUpdatedTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}
