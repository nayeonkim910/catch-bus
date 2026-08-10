import { useEffect, useRef, type RefObject } from 'react';
import { BusIcon } from '@shared/components/ui/BusIcon';
import type { RouteStation } from '@shared/types/bus';
import { getRouteTheme } from '@shared/utils/routeTheme';

type RouteStationDetailsProps = {
  id: string;
  stations: RouteStation[] | undefined;
  targetStationId: string;
  targetStationOrder: number;
  currentStationSequence: number | null;
  routeTypeCode: number;
  isLoading: boolean;
};

type RouteStationItemProps = {
  station: RouteStation;
  targetStationId: string;
  targetStationOrder: number;
  currentStationSequence: number | null;
  accentColor: string;
  targetRef: RefObject<HTMLLIElement | null>;
};

function RouteStationItem({
  station,
  targetStationId,
  targetStationOrder,
  currentStationSequence,
  accentColor,
  targetRef,
}: RouteStationItemProps) {
  const isTarget = station.id === targetStationId && station.sequence === targetStationOrder;
  // 정류장명은 중복될 수 있으므로 현재 버스 위치는 노선 내 순번으로 판별한다.
  const isCurrent = station.sequence === currentStationSequence;
  const isHighlighted = isTarget || isCurrent;

  return (
    <li
      className={`relative flex min-h-16 items-center gap-3 rounded-lg py-2 pr-3 pl-11 ${isTarget ? 'bg-accent' : 'hover:bg-accent'}`}
      ref={isTarget ? targetRef : undefined}
    >
      <span
        className={`${isHighlighted ? 'size-5 border-[3px]' : 'size-3 border-2'} absolute left-5 z-10 -translate-x-1/2 rounded-full bg-card`}
        style={{ borderColor: isHighlighted ? accentColor : '#94A3B8' }}
        aria-hidden="true"
      />

      {isCurrent && (
        <span
          className="absolute left-5 z-20 grid size-8 -translate-x-1/2 place-items-center rounded-md border-2 border-white text-white shadow-md"
          style={{ backgroundColor: accentColor }}
          aria-label="현재 버스 위치"
        >
          <BusIcon className="h-5 w-6 stroke-[1.8]" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <strong
          className={`block truncate text-sm ${isTarget ? 'text-primary' : 'text-foreground'}`}
          title={station.name}
        >
          {station.name}
          {isTarget && <span className="ml-1">· 선택 정류장</span>}
        </strong>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {station.mobileNo ? `정류소 ${station.mobileNo}` : `${station.sequence}번째 정류장`}
        </span>
      </span>
    </li>
  );
}

export function RouteStationDetails({
  id,
  stations,
  targetStationId,
  targetStationOrder,
  currentStationSequence,
  routeTypeCode,
  isLoading,
}: RouteStationDetailsProps) {
  const theme = getRouteTheme(routeTypeCode);
  const listRef = useRef<HTMLOListElement>(null);
  const targetRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const target = targetRef.current;
    if (!list || !target) return;

    list.scrollTop = target.offsetTop - list.clientHeight / 2 + target.clientHeight / 2;
  }, [stations, targetStationId, targetStationOrder]);

  return (
    <div className="col-span-full border-t border-border pt-3" id={id}>
      <h3 className="mb-3 text-sm font-semibold text-foreground">전체 경유 정류장</h3>
      {isLoading ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          노선 정보를 불러오는 중입니다.
        </p>
      ) : stations && stations.length > 0 ? (
        <div className="relative">
          <span
            className="pointer-events-none absolute top-5 bottom-5 left-[19px] w-0.5 bg-border"
            aria-hidden="true"
          />
          <ol className="hover-scrollbar relative max-h-80 overflow-y-auto pr-2" ref={listRef}>
            {stations.map((station) => (
              <RouteStationItem
                key={`${station.id}-${station.sequence}`}
                station={station}
                targetStationId={targetStationId}
                targetStationOrder={targetStationOrder}
                currentStationSequence={currentStationSequence}
                accentColor={theme.accentColor}
                targetRef={targetRef}
              />
            ))}
          </ol>
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">노선 정보가 없습니다.</p>
      )}
    </div>
  );
}
