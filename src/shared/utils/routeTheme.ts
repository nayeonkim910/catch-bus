type RoutePalette = {
  accentColor: string;
  routeClassName: string;
  typeClassName: string;
};

type RouteTheme = RoutePalette & {
  label: string;
};

const PALETTES = {
  blue: {
    accentColor: '#2563EB',
    routeClassName: 'bg-blue-600 text-white',
    typeClassName: 'bg-blue-50 text-blue-700',
  },
  cyan: {
    accentColor: '#0891B2',
    routeClassName: 'bg-cyan-600 text-white',
    typeClassName: 'bg-cyan-50 text-cyan-700',
  },
  green: {
    accentColor: '#10B981',
    routeClassName: 'bg-emerald-500 text-white',
    typeClassName: 'bg-emerald-50 text-emerald-700',
  },
  indigo: {
    accentColor: '#4F46E5',
    routeClassName: 'bg-indigo-600 text-white',
    typeClassName: 'bg-indigo-50 text-indigo-700',
  },
  red: {
    accentColor: '#EF4444',
    routeClassName: 'bg-red-500 text-white',
    typeClassName: 'bg-red-50 text-red-700',
  },
  redStrong: {
    accentColor: '#DC2626',
    routeClassName: 'bg-red-600 text-white',
    typeClassName: 'bg-red-50 text-red-700',
  },
  violet: {
    accentColor: '#7C3AED',
    routeClassName: 'bg-violet-600 text-white',
    typeClassName: 'bg-violet-50 text-violet-700',
  },
} satisfies Record<string, RoutePalette>;

function createTheme(label: string, palette: RoutePalette): RouteTheme {
  return { label, ...palette };
}

const GENERAL_THEME = createTheme('일반', PALETTES.blue);
const ROUTE_THEMES: Record<number, RouteTheme> = {
  11: createTheme('직행좌석', PALETTES.red),
  12: createTheme('좌석', PALETTES.indigo),
  13: GENERAL_THEME,
  14: createTheme('광역급행', PALETTES.redStrong),
  15: createTheme('맞춤형', PALETTES.green),
  16: createTheme('순환', PALETTES.red),
  21: createTheme('직행좌석', PALETTES.red),
  22: createTheme('좌석', PALETTES.indigo),
  23: GENERAL_THEME,
  30: createTheme('마을', PALETTES.green),
  41: createTheme('시외', PALETTES.violet),
  42: createTheme('시외', PALETTES.violet),
  43: createTheme('시외', PALETTES.violet),
  51: createTheme('공항', PALETTES.cyan),
  52: createTheme('공항', PALETTES.cyan),
  53: createTheme('공항', PALETTES.cyan),
};

export function getRouteTheme(routeTypeCode: number) {
  return ROUTE_THEMES[routeTypeCode] ?? createTheme('버스', PALETTES.blue);
}
