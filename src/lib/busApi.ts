import type {
  BusArrival,
  BusStation,
  RouteInfo,
  RouteLinePoint,
  RouteStation,
  RouteSummary,
  VehicleLocation,
} from '../shared/types/bus';

type StationSearchResponse = {
  data: {
    stations: BusStation[];
  };
  meta: {
    updatedAt: string;
  };
};

type StationArrivalsResponse = {
  data: {
    arrivals: BusArrival[];
  };
  meta: {
    updatedAt: string;
  };
};

type ApiResponse<T> = {
  data: T;
  meta: { updatedAt: string };
};

type ErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

function getRequestErrorMessage(payload: ErrorResponse | null) {
  if (payload?.error?.code === 'UPSTREAM_ERROR') {
    return '공공 버스 API 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.';
  }

  return payload?.error?.message ?? '버스정보 요청에 실패했습니다.';
}

// env는 빌드 타임에 고정되므로 첫 요청에 한 번만 읽어 캐시한다. 매 요청마다 재계산하지 않는다.
// (최상위에서 즉시 호출하지 않는 이유: env 없는 환경에서 이 모듈을 import만 해도 throw나는 걸 피하기 위함)
let cachedApiConfig: { baseUrl: string; publishableKey: string } | null = null;

function getApiConfig() {
  if (cachedApiConfig) return cachedApiConfig;

  const baseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!baseUrl || !publishableKey) {
    throw new Error('Supabase API 환경변수가 설정되지 않았습니다.');
  }

  cachedApiConfig = { baseUrl, publishableKey };
  return cachedApiConfig;
}

async function requestBusApi<T>(
  action: string,
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  const { baseUrl, publishableKey } = getApiConfig();
  const endpoint = new URL('/functions/v1/bus-api', baseUrl);
  endpoint.searchParams.set('action', action);

  for (const [key, value] of Object.entries(params)) {
    endpoint.searchParams.set(key, value);
  }

  const response = await fetch(endpoint, {
    headers: { apikey: publishableKey },
    signal,
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = payload as ErrorResponse | null;
    throw new Error(getRequestErrorMessage(errorPayload));
  }

  return payload as T;
}

export async function searchStations(
  query: string,
  signal?: AbortSignal,
): Promise<StationSearchResponse> {
  const payload = await requestBusApi<StationSearchResponse>('search-stations', { query }, signal);

  if (
    !payload ||
    typeof payload !== 'object' ||
    !('data' in payload) ||
    !payload.data ||
    typeof payload.data !== 'object' ||
    !('stations' in payload.data) ||
    !Array.isArray(payload.data.stations)
  ) {
    throw new Error('정류장 검색 응답 형식이 올바르지 않습니다.');
  }

  return payload as StationSearchResponse;
}

export async function getStationArrivals(
  stationId: string,
  signal?: AbortSignal,
): Promise<StationArrivalsResponse> {
  const payload = await requestBusApi<StationArrivalsResponse>(
    'station-arrivals',
    { stationId },
    signal,
  );

  if (
    !payload ||
    typeof payload !== 'object' ||
    !('data' in payload) ||
    !payload.data ||
    typeof payload.data !== 'object' ||
    !('arrivals' in payload.data) ||
    !Array.isArray(payload.data.arrivals)
  ) {
    throw new Error('도착정보 응답 형식이 올바르지 않습니다.');
  }

  return payload;
}

export function getNearbyStations(latitude: number, longitude: number, signal?: AbortSignal) {
  return requestBusApi<ApiResponse<{ stations: BusStation[] }>>(
    'nearby-stations',
    { latitude: String(latitude), longitude: String(longitude) },
    signal,
  ).then((payload) => {
    if (!Array.isArray(payload?.data?.stations)) {
      throw new Error('근처 정류장 응답 형식이 올바르지 않습니다.');
    }

    return payload;
  });
}

export function searchBusRoutes(query: string, signal?: AbortSignal) {
  return requestBusApi<ApiResponse<{ routes: RouteSummary[] }>>('search-routes', { query }, signal);
}

export function getRouteInfo(routeId: string, signal?: AbortSignal) {
  return requestBusApi<ApiResponse<{ route: RouteInfo }>>('route-info', { routeId }, signal);
}

export function getRouteStations(routeId: string, signal?: AbortSignal) {
  return requestBusApi<ApiResponse<{ stations: RouteStation[] }>>(
    'route-stations',
    { routeId },
    signal,
  );
}

export function getRouteLine(routeId: string, signal?: AbortSignal) {
  return requestBusApi<ApiResponse<{ points: RouteLinePoint[] }>>(
    'route-line',
    { routeId },
    signal,
  );
}

export function getBusLocations(routeId: string, signal?: AbortSignal) {
  return requestBusApi<ApiResponse<{ locations: VehicleLocation[] }>>(
    'bus-locations',
    { routeId },
    signal,
  );
}
