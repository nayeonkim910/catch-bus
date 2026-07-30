import { useId, useState, type KeyboardEvent } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { Button } from '@shared/components/ui/Button';
import { RouteBadge } from '@features/routes/RouteBadge';
import type { BusArrival, BusStation } from '@shared/types/bus';
import { useFavorites } from '@features/favorites/useFavorites';
import { useRouteStationData } from '@features/routes/useRouteStationData';
import { ArrivalHero } from './ArrivalHero';
import { RouteStationDetails } from './RouteStationDetails';

type ArrivalCardProps = {
  station: BusStation;
  arrival: BusArrival;
  isRouteSelected: boolean;
  onSelectRoute: () => void;
  stationLabel?: string;
};

export function ArrivalCard({
  station,
  arrival,
  isRouteSelected,
  onSelectRoute,
  stationLabel,
}: ArrivalCardProps) {
  // 즐겨찾기 상태는 store에서 직접 구독하며 favorites 변경 시 리렌더되어 별표 반영함.
  const { isFavorite, toggle } = useFavorites();
  const isFavorited = isFavorite(station.id, arrival.routeId);
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);
  const routeDetailsId = useId();
  // 곧 도착할 첫 번째 버스. 도착 시간·남은 정거장·저상 여부가 전부 이 차량 기준이다.
  const firstBus = arrival.first;
  const arrivalSeconds = firstBus?.arrivalSeconds ?? null;
  const routeStationData = useRouteStationData(
    arrival.routeId,
    arrival.stationId,
    arrival.stationOrder,
    isRouteExpanded,
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
          안의 별과 상세 노선 버튼은 stopPropagation으로 카드 클릭과 분리한다. */}
      <article
        className={`flex min-h-36 cursor-pointer flex-col rounded-xl border-2 bg-card p-4 shadow-sm transition-[border-color,box-shadow,background-color] hover:border-primary/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring ${
          isRouteSelected ? 'border-primary bg-accent/60' : 'border-border'
        }`}
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
        {stationLabel && (
          <p className="mt-1 truncate text-xs font-medium text-muted-foreground">{stationLabel}</p>
        )}

        <ArrivalHero arrival={arrival} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="truncate text-xs text-muted-foreground">
            {arrivalSeconds != null && (
              <>
                {firstBus?.remainingStops != null
                  ? `${firstBus.remainingStops}정거장 전`
                  : '남은 정거장 정보 없음'}
                {firstBus?.isLowFloor ? ' · 저상버스' : ''}
              </>
            )}
          </p>
          <Button
            variant="link"
            size="xs"
            className="shrink-0"
            aria-expanded={isRouteExpanded}
            aria-controls={routeDetailsId}
            onClick={(event) => {
              event.stopPropagation();
              setIsRouteExpanded((expanded) => !expanded);
            }}
          >
            상세 노선
            <ChevronDown
              className={`size-3.5 transition-transform ${isRouteExpanded ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>
      </article>

      {isRouteExpanded && (
        <RouteStationDetails
          id={routeDetailsId}
          stations={routeStationData.data?.stations}
          targetStationId={arrival.stationId}
          targetStationOrder={arrival.stationOrder}
          currentStationSequence={firstBus?.currentStationSequence ?? null}
          routeTypeCode={arrival.routeTypeCode}
          isLoading={routeStationData.isLoading}
        />
      )}
    </div>
  );
}
