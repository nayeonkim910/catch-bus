import { useId, useState, type KeyboardEvent } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@shared/components/ui/Button';
import { RouteBadge } from '@features/routes/RouteBadge';
import type { BusArrival, BusStation } from '@shared/types/bus';
import { useFavorites } from '@features/favorites/useFavorites';
import { useRouteStationData } from '@features/routes/useRouteStationData';
import { getArrivalCardStatus } from './arrivalCardStatus';
import { ArrivalSummary } from './ArrivalSummary';
import { RouteStationDetails } from './RouteStationDetails';

type ArrivalCardProps = {
  station: BusStation;
  arrival: BusArrival;
  isRouteSelected: boolean;
  onSelectRoute: () => void;
};

export function ArrivalCard({
  station,
  arrival,
  isRouteSelected,
  onSelectRoute,
}: ArrivalCardProps) {
  // 즐겨찾기 상태는 store에서 직접 구독하며 favorites 변경 시 리렌더되어 별표 반영함.
  const { isFavorite, toggle } = useFavorites();
  const isFavorited = isFavorite(station.id, arrival.routeId);
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);
  const routeDetailsId = useId();
  const arrivalSeconds = arrival.first?.arrivalSeconds ?? null;
  // 도착 예정 시간이 있을 때만 강조 상태를 계산한다. 없으면 ArrivalSummary가 운행 상태만 표시한다.
  const arrivalStatus = arrivalSeconds != null ? getArrivalCardStatus(arrivalSeconds) : null;
  const routeStationData = useRouteStationData(
    arrival.routeId,
    arrival.stationId,
    arrival.stationOrder,
  );

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectRoute();
    }
  }

  return (
    <div>
      {/* 카드 전체가 클릭 트리거다. 클릭하면 지도에서 이 노선을 보여준다(onSelectRoute).
          안의 별과 상세 노선 보기 버튼은 stopPropagation으로 카드 클릭과 분리한다. */}
      <article
        className={`flex h-36 cursor-pointer flex-col rounded-xl border-2 bg-card p-4 shadow-sm transition-[border-color,box-shadow,background-color] hover:border-primary/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring ${
          isRouteSelected ? 'border-primary bg-accent/60' : 'border-border'
        } ${arrivalStatus?.cardClassName ?? ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={isRouteSelected}
        aria-label={`${arrival.routeName}번 지도에서 보기`}
        onClick={onSelectRoute}
        onKeyDown={handleCardKeyDown}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <RouteBadge routeName={arrival.routeName} routeTypeCode={arrival.routeTypeCode} />
            <span className="truncate text-sm font-semibold text-foreground">
              {arrival.destinationName} 방면
            </span>
          </div>
          <Button
            variant={isFavorited ? 'primary' : 'secondary'}
            size="icon"
            className="size-8 shrink-0"
            aria-label={`${arrival.routeName}번 즐겨찾기 ${isFavorited ? '삭제' : '추가'}`}
            aria-pressed={isFavorited}
            onClick={(event) => {
              event.stopPropagation();
              toggle(station, arrival);
            }}
          >
            <Star className="size-5 shrink-0" fill={isFavorited ? 'currentColor' : 'none'} />
          </Button>
        </div>

        <ArrivalSummary arrival={arrival} status={arrivalStatus} />

        <Button
          variant="tertiary"
          size="sm"
          className="mt-auto self-start"
          aria-expanded={isRouteExpanded}
          aria-controls={routeDetailsId}
          onClick={(event) => {
            event.stopPropagation();
            setIsRouteExpanded((expanded) => !expanded);
          }}
        >
          {isRouteExpanded ? '상세 노선 닫기' : '상세 노선 보기'}
        </Button>
      </article>

      {isRouteExpanded && (
        <RouteStationDetails
          id={routeDetailsId}
          stations={routeStationData.data?.stations}
          targetStationId={arrival.stationId}
          targetStationOrder={arrival.stationOrder}
          currentStationSequence={arrival.first?.currentStationSequence ?? null}
          routeTypeCode={arrival.routeTypeCode}
          isLoading={routeStationData.isLoading}
        />
      )}
    </div>
  );
}
