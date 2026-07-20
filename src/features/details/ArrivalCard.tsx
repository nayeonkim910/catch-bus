import { useId, useState, type KeyboardEvent } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { RouteBadge } from '../../shared/components/RouteBadge';
import type { BusArrival } from '../../shared/types/bus';
import { formatArrivalTime } from '../../shared/utils/arrival';
import { useRouteStationData } from '../routes/useRouteStationData';
import { getArrivalCardStatus } from './arrivalCardStatus';
import { RouteStationDetails } from './RouteStationDetails';

type ArrivalCardProps = {
  arrival: BusArrival;
  isFavorite: boolean;
  isRouteSelected: boolean;
  onToggleFavorite: () => void;
  onSelectRoute: () => void;
};

export function ArrivalCard({
  arrival,
  isFavorite,
  isRouteSelected,
  onToggleFavorite,
  onSelectRoute,
}: ArrivalCardProps) {
  const [isRouteExpanded, setIsRouteExpanded] = useState(false);
  const routeDetailsId = useId();
  const first = arrival.first;
  const arrivalStatus = getArrivalCardStatus(first?.arrivalSeconds ?? null);
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
        className={`flex h-36 cursor-pointer flex-col rounded-xl border-2 bg-white p-4 shadow-sm transition-[border-color,box-shadow,background-color] hover:border-blue-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
          isRouteSelected ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200'
        } ${arrivalStatus.cardClassName}`}
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
            <span className="truncate text-sm font-semibold text-slate-700">
              {arrival.destinationName} 방면
            </span>
          </div>
          <Button
            variant={isFavorite ? 'primary' : 'secondary'}
            size="icon"
            className="size-8 shrink-0"
            aria-label={`${arrival.routeName}번 즐겨찾기 ${isFavorite ? '삭제' : '추가'}`}
            aria-pressed={isFavorite}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Star className="size-5 shrink-0" fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
        </div>

        {/* 히어로 행: 첫차 도착이 주 정보로 크게, 다음차는 같은 baseline 오른쪽에 작게 종속시킨다. */}
        <div className="mt-1 flex items-end justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-end gap-2">
            <strong className="text-2xl leading-none text-brand">
              {formatArrivalTime(first?.arrivalSeconds ?? null)}
            </strong>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${arrivalStatus.className}`}
            >
              {arrivalStatus.label}
            </span>
          </div>
          {arrival.second?.arrivalSeconds != null && (
            <span className="shrink-0 text-xs font-medium whitespace-nowrap text-slate-400">
              다음 {formatArrivalTime(arrival.second.arrivalSeconds)}
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-xs text-slate-500">
          {first?.remainingStops != null
            ? `${first.remainingStops}정거장 전`
            : '남은 정거장 정보 없음'}
          {first?.isLowFloor ? ' · 저상버스' : ''}
          {first?.currentStationName ? ` · 현재 ${first.currentStationName} 통과` : ''}
        </p>

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
          currentStationSequence={first?.currentStationSequence ?? null}
          routeTypeCode={arrival.routeTypeCode}
          isLoading={routeStationData.isLoading}
        />
      )}
    </div>
  );
}
