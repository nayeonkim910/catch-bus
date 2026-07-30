import { X } from 'lucide-react';
import { RouteBadge } from '@features/routes/RouteBadge';
import { Button } from '@shared/components/ui/Button';
import type { SelectedRoute } from '@features/selection/selectedRoute';

type RouteOverlayPanelProps = {
  route: SelectedRoute;
  busCount: number;
  isLoading: boolean;
  isError: boolean;
  onClear: () => void;
};

function getStatus(busCount: number, isLoading: boolean, isError: boolean) {
  if (isError) return { text: '실시간 위치를 불러오지 못했어요', tone: 'error' as const };
  if (isLoading) return { text: '실시간 위치 불러오는 중…', tone: 'loading' as const };
  if (busCount > 0) {
    return { text: `실시간 ${busCount}대 운행 중 · 20초마다 자동 갱신`, tone: 'live' as const };
  }
  return { text: '운행 중인 차량이 없어요', tone: 'idle' as const };
}

const DOT_TONE = {
  error: 'bg-red-500',
  loading: 'bg-slate-300',
  live: 'animate-pulse bg-emerald-500',
  idle: 'bg-slate-300',
};

export function RouteOverlayPanel({
  route,
  busCount,
  isLoading,
  isError,
  onClear,
}: RouteOverlayPanelProps) {
  const status = getStatus(busCount, isLoading, isError);

  return (
    <section
      className="pointer-events-auto flex max-w-xs items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur"
      aria-label={`지도에 표시 중인 노선 ${route.routeName}번`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <RouteBadge routeName={route.routeName} routeTypeCode={route.routeTypeCode} />
          <span className="truncate text-sm font-semibold text-slate-700">
            {route.destinationName} 방면
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500" role="status">
          <span
            className={`size-1.5 shrink-0 rounded-full ${DOT_TONE[status.tone]}`}
            aria-hidden="true"
          />
          {status.text}
        </p>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="shrink-0"
        onClick={onClear}
        aria-label="노선 표시 닫기"
      >
        <X className="size-5 shrink-0" />
      </Button>
    </section>
  );
}
