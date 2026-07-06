type RouteTheme = {
  label: string
  routeClassName: string
  typeClassName: string
}

const GENERAL_THEME: RouteTheme = {
  label: '일반',
  routeClassName: 'bg-blue-600 text-white',
  typeClassName: 'bg-blue-50 text-blue-700',
}

const ROUTE_THEMES: Record<number, RouteTheme> = {
  11: {
    label: '직행좌석',
    routeClassName: 'bg-red-500 text-white',
    typeClassName: 'bg-red-50 text-red-700',
  },
  12: {
    label: '좌석',
    routeClassName: 'bg-indigo-600 text-white',
    typeClassName: 'bg-indigo-50 text-indigo-700',
  },
  13: GENERAL_THEME,
  14: {
    label: '광역급행',
    routeClassName: 'bg-red-600 text-white',
    typeClassName: 'bg-red-50 text-red-700',
  },
  15: {
    label: '맞춤형',
    routeClassName: 'bg-emerald-500 text-white',
    typeClassName: 'bg-emerald-50 text-emerald-700',
  },
  16: {
    label: '순환',
    routeClassName: 'bg-red-500 text-white',
    typeClassName: 'bg-red-50 text-red-700',
  },
  21: {
    label: '직행좌석',
    routeClassName: 'bg-red-500 text-white',
    typeClassName: 'bg-red-50 text-red-700',
  },
  22: {
    label: '좌석',
    routeClassName: 'bg-indigo-600 text-white',
    typeClassName: 'bg-indigo-50 text-indigo-700',
  },
  23: GENERAL_THEME,
  30: {
    label: '마을',
    routeClassName: 'bg-emerald-500 text-white',
    typeClassName: 'bg-emerald-50 text-emerald-700',
  },
  41: {
    label: '시외',
    routeClassName: 'bg-violet-600 text-white',
    typeClassName: 'bg-violet-50 text-violet-700',
  },
  42: {
    label: '시외',
    routeClassName: 'bg-violet-600 text-white',
    typeClassName: 'bg-violet-50 text-violet-700',
  },
  43: {
    label: '시외',
    routeClassName: 'bg-violet-600 text-white',
    typeClassName: 'bg-violet-50 text-violet-700',
  },
  51: {
    label: '공항',
    routeClassName: 'bg-cyan-600 text-white',
    typeClassName: 'bg-cyan-50 text-cyan-700',
  },
  52: {
    label: '공항',
    routeClassName: 'bg-cyan-600 text-white',
    typeClassName: 'bg-cyan-50 text-cyan-700',
  },
  53: {
    label: '공항',
    routeClassName: 'bg-cyan-600 text-white',
    typeClassName: 'bg-cyan-50 text-cyan-700',
  },
}

export function getRouteTheme(routeTypeCode: number) {
  return ROUTE_THEMES[routeTypeCode] ?? {
    ...GENERAL_THEME,
    label: '버스',
  }
}
