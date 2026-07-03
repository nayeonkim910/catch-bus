type RouteProgressProps = {
  currentStationName: string | null
  destinationStationName: string
  remainingStops: number | null
  compact?: boolean
}

const MAX_DIRECT_STOPS = 5
const VISIBLE_STOPS_WHEN_COLLAPSED = 4

export function RouteProgress({
  currentStationName,
  destinationStationName,
  remainingStops,
  compact = false,
}: RouteProgressProps) {
  const intermediateStops = Math.max((remainingStops ?? 1) - 1, 0)
  const hasHiddenStops = intermediateStops > MAX_DIRECT_STOPS
  const visibleStops = hasHiddenStops ? VISIBLE_STOPS_WHEN_COLLAPSED : intermediateStops
  const hiddenStops = hasHiddenStops ? intermediateStops - visibleStops : 0

  return (
    <div className={compact ? 'mt-3' : 'mt-4'}>
      <div
        className="flex items-center"
        role="img"
        aria-label={
          remainingStops === null
            ? `버스 위치 정보 없음, 목적지 ${destinationStationName}`
            : `버스는 ${currentStationName ?? '현재 위치'}에 있으며 ${destinationStationName}까지 ${remainingStops}정거장 남음`
        }
      >
        <div className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white shadow-sm">
          <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 16V6.5C6 4.6 8.7 4 12 4s6 .6 6 2.5V16" />
            <path d="M6 11h12M8 16h8M8 19v1M16 19v1" />
            <circle cx="9" cy="14" r=".8" fill="currentColor" />
            <circle cx="15" cy="14" r=".8" fill="currentColor" />
          </svg>
        </div>

        {hasHiddenStops && (
          <>
            <div className="h-0.5 min-w-3 flex-1 bg-blue-200" />
            <span className="shrink-0 px-1 text-[10px] font-semibold text-slate-400">+{hiddenStops}</span>
          </>
        )}

        {Array.from({ length: visibleStops }, (_, index) => (
          <div className="contents" key={index}>
            <div className="h-0.5 min-w-3 flex-1 bg-blue-200" />
            <span className="size-2.5 shrink-0 rounded-full border-2 border-blue-300 bg-white" />
          </div>
        ))}

        <div className="h-0.5 min-w-3 flex-1 bg-blue-200" />
        <span className="relative size-4 shrink-0 rounded-full border-[3px] border-brand bg-white shadow-[0_0_0_3px_rgb(37_99_235/12%)]" />
      </div>

      <div className="mt-2 flex items-start justify-between gap-4 text-[11px] text-slate-500">
        <span className="max-w-[55%] truncate">{currentStationName ?? '차량 위치 정보 없음'}</span>
        <span className="max-w-[40%] truncate text-right font-medium text-slate-700">{destinationStationName}</span>
      </div>
    </div>
  )
}
