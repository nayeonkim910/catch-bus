import { useEffect, useRef, type RefObject } from 'react'
import { BusIcon } from '../../shared/components/BusIcon'
import type { RouteStation } from '../../shared/types/bus'
import { getRouteTheme } from '../../shared/utils/routeTheme'

type RouteStationDetailsProps = {
  id: string
  stations: RouteStation[] | undefined
  targetStationId: string
  targetStationOrder: number
  currentStationName: string | null
  routeTypeCode: number
  isLoading: boolean
}

type RouteStationItemProps = {
  station: RouteStation
  targetStationId: string
  targetStationOrder: number
  currentStationName: string | null
  accentColor: string
  targetRef: RefObject<HTMLLIElement | null>
}

function RouteStationItem({
  station,
  targetStationId,
  targetStationOrder,
  currentStationName,
  accentColor,
  targetRef,
}: RouteStationItemProps) {
  const isTarget =
    station.id === targetStationId && station.sequence === targetStationOrder
  const isCurrent = station.name === currentStationName
  const isHighlighted = isTarget || isCurrent

  return (
    <li
      className={`relative flex min-h-16 items-center gap-3 rounded-lg py-2 pr-3 pl-11 ${isTarget ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
      ref={isTarget ? targetRef : undefined}
    >
      <span
        className={`${isHighlighted ? 'size-5 border-[3px]' : 'size-3 border-2'} absolute left-5 z-10 -translate-x-1/2 rounded-full bg-white`}
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
          className={`block truncate text-sm ${isTarget ? 'text-brand' : 'text-slate-700'}`}
          title={station.name}
        >
          {station.name}
          {isTarget && <span className="ml-1">· 선택 정류장</span>}
        </strong>
        <span className="mt-0.5 block text-xs text-slate-400">
          {station.mobileNo
            ? `정류소 ${station.mobileNo}`
            : `${station.sequence}번째 정류장`}
        </span>
      </span>
    </li>
  )
}

export function RouteStationDetails({
  id,
  stations,
  targetStationId,
  targetStationOrder,
  currentStationName,
  routeTypeCode,
  isLoading,
}: RouteStationDetailsProps) {
  const theme = getRouteTheme(routeTypeCode)
  const listRef = useRef<HTMLOListElement>(null)
  const targetRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const list = listRef.current
    const target = targetRef.current
    if (!list || !target) return

    list.scrollTop = target.offsetTop - list.clientHeight / 2 + target.clientHeight / 2
  }, [stations, targetStationId, targetStationOrder])

  return (
    <div className="col-span-full border-t border-slate-100 pt-3" id={id}>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">전체 경유 정류장</h3>
      {isLoading ? (
        <p className="py-4 text-center text-sm text-slate-400">노선 정보를 불러오는 중입니다.</p>
      ) : stations && stations.length > 0 ? (
        <div className="relative">
          <span
            className="pointer-events-none absolute top-5 bottom-5 left-[19px] w-0.5 bg-slate-300"
            aria-hidden="true"
          />
          <ol
            className="hover-scrollbar relative max-h-80 overflow-y-auto pr-2"
            ref={listRef}
          >
            {stations.map((station) => (
              <RouteStationItem
                key={`${station.id}-${station.sequence}`}
                station={station}
                targetStationId={targetStationId}
                targetStationOrder={targetStationOrder}
                currentStationName={currentStationName}
                accentColor={theme.accentColor}
                targetRef={targetRef}
              />
            ))}
          </ol>
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-slate-400">노선 정보가 없습니다.</p>
      )}
    </div>
  )
}
