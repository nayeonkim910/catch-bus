// idle은 정류장을 선택하지 않아 도착정보 요청이 아직 시작되지 않은 상태다.
export type ArrivalStatus = 'idle' | 'loading' | 'success' | 'error';
