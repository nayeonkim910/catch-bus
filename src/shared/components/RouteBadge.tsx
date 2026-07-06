import { getRouteTheme } from '../utils/routeTheme'

type RouteBadgeProps = {
  routeName: string
  routeTypeCode: number
}

export function RouteBadge({ routeName, routeTypeCode }: RouteBadgeProps) {
  const theme = getRouteTheme(routeTypeCode)

  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span className={`rounded-md px-2 py-1 text-sm font-bold ${theme.routeClassName}`}>
        {routeName}
      </span>
      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${theme.typeClassName}`}>
        {theme.label}
      </span>
    </span>
  )
}
