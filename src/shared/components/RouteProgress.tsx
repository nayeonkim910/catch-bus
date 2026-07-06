import { getRouteProgressModel } from '../utils/routeProgress'
import { getRouteTheme } from '../utils/routeTheme'
import {
  FallbackStationLabels,
  RouteProgressTrack,
} from './RouteProgressTrack'

type RouteProgressProps = {
  currentStationName: string | null
  destinationStationName: string
  remainingStops: number | null
  routeTypeCode: number
  stationNames?: (string | null)[] | null
  compact?: boolean
  horizontal?: boolean
}

export function RouteProgress({
  currentStationName,
  destinationStationName,
  remainingStops,
  routeTypeCode,
  stationNames,
  compact = false,
  horizontal = false,
}: RouteProgressProps) {
  const theme = getRouteTheme(routeTypeCode)
  const progress = getRouteProgressModel({
    currentStationName,
    destinationStationName,
    remainingStops,
    stationNames,
  })
  const spacingClass = horizontal ? 'mt-3 lg:mt-0' : compact ? 'mt-3' : 'mt-4'

  return (
    <div className={spacingClass}>
      <div
        className="relative mx-3 h-16"
        role="img"
        aria-label={progress.accessibleLabel}
      >
        <RouteProgressTrack
          accentColor={theme.accentColor}
          busPosition={progress.busPosition}
          traveledWidth={progress.traveledWidth}
          nodes={progress.nodes}
        />

        <FallbackStationLabels
          current={progress.currentStationFallback}
          destination={progress.destinationStationFallback}
        />
      </div>

      {!progress.hasVehicleLocation && (
        <p className="text-[11px] text-slate-400">차량 위치 정보 없음</p>
      )}
    </div>
  )
}
