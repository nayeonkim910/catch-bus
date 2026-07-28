import type { BusArrival } from '@shared/types/bus';
import { formatArrivalTime } from '@shared/utils/arrival';
import { getNoArrivalLabel, type ArrivalCardStatus } from './arrivalCardStatus';

type ArrivalSummaryProps = {
  arrival: BusArrival;
  status: ArrivalCardStatus | null;
};

/**
 * 카드의 도착 정보 블록. 두 상태를 guard clause로 나눈다.
 * - 도착 예정 시간 없음: 운행 상태(운행 종료/회차지 대기/도착 예정 정보 없음) 한 줄만.
 * - 있음: 첫차 시간(크게) + 강조 배지 + 다음차 + 위치/저상 등 상세.
 */
export function ArrivalSummary({ arrival, status }: ArrivalSummaryProps) {
  if (!status) {
    return (
      <p className="mt-1 truncate text-xs text-muted-foreground">
        {getNoArrivalLabel(arrival.status)}
      </p>
    );
  }

  const first = arrival.first;

  return (
    <>
      {/* 히어로 행: 첫차가 주 정보로 크게, 다음차는 오른쪽에 작게 종속. */}
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-end gap-2">
          <strong className="text-2xl leading-none text-brand">
            {formatArrivalTime(first?.arrivalSeconds ?? null)}
          </strong>
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${status.className}`}>
            {status.label}
          </span>
        </div>
        {arrival.second?.arrivalSeconds != null && (
          <span className="shrink-0 text-xs font-medium whitespace-nowrap text-muted-foreground">
            다음 {formatArrivalTime(arrival.second.arrivalSeconds)}
          </span>
        )}
      </div>

      <p className="mt-1 truncate text-xs text-muted-foreground">
        {first?.remainingStops != null
          ? `${first.remainingStops}정거장 전`
          : '남은 정거장 정보 없음'}
        {first?.isLowFloor ? ' · 저상버스' : ''}
        {first?.currentStationName ? ` · 현재 ${first.currentStationName} 통과` : ''}
      </p>
    </>
  );
}
