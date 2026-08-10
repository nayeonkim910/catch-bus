import { Button } from '@shared/components/ui/Button';
import type { BusStation } from '@shared/types/bus';
import { ArrivalList } from './ArrivalList';
import { DetailsPanelHeader } from './DetailsPanelHeader';
import { useStationArrivals } from './useStationArrivals';

type StationArrivalsPanelProps = {
  station: BusStation;
};

/**
 * 선택 정류장의 도착정보를 직접 조회해 렌더한다(콜로케이션).
 *
 * 도착정보를 App에서 내려받지 않고 여기서 useStationArrivals로 조회한다. 즐겨찾기 탭이
 * 같은 queryKey를 공유하므로 네트워크 요청은 정류장당 한 번이다. 로딩·에러는 React Query
 * 상태로 바로 분기하고, 별도 상태 enum(ArrivalStatus)을 만들어 내리지 않는다.
 */
export function StationArrivalsPanel({ station }: StationArrivalsPanelProps) {
  const { data, isPending, isError, error, refetch } = useStationArrivals(station.id);
  const arrivals = data ?? [];

  return (
    <>
      <DetailsPanelHeader station={station} updatedAt={arrivals[0]?.updatedAt} />
      <section className="hover-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-border/70 p-4 sm:p-5 lg:px-5 lg:py-4">
        {isPending ? (
          <LoadingArrivals />
        ) : isError ? (
          <ArrivalError
            message={error instanceof Error ? error.message : null}
            onRetry={() => void refetch()}
          />
        ) : arrivals.length === 0 ? (
          <EmptyArrivals />
        ) : (
          <ArrivalList station={station} arrivals={arrivals} />
        )}
      </section>
    </>
  );
}

function LoadingArrivals() {
  return (
    <div className="space-y-3" aria-live="polite" aria-label="도착정보를 불러오는 중">
      {[0, 1, 2].map((item) => (
        <div
          className="h-36 animate-pulse rounded-xl border border-border bg-card"
          key={item}
        />
      ))}
    </div>
  );
}

function ArrivalError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-danger bg-danger-muted p-5 text-center">
      <p className="text-sm text-danger" role="alert">
        {message ?? '도착정보를 불러오지 못했습니다.'}
      </p>
      <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

function EmptyArrivals() {
  return (
    <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
      도착 예정 버스가 없습니다.
    </p>
  );
}
