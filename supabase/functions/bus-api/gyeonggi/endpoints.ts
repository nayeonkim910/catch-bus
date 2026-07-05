const GYEONGGI_API_ORIGIN = "https://apis.data.go.kr/6410000";

const createServiceUrl = (servicePath: string) =>
  `${GYEONGGI_API_ORIGIN}/${servicePath}/v2`;

const stationServiceUrl = createServiceUrl("busstationservice");
const routeServiceUrl = createServiceUrl("busrouteservice");
const locationServiceUrl = createServiceUrl("buslocationservice");
const arrivalServiceUrl = createServiceUrl("busarrivalservice");

export const gyeonggiEndpoints = {
  station: {
    search: `${stationServiceUrl}/getBusStationListv2`,
    nearby: `${stationServiceUrl}/getBusStationAroundListv2`,
    routes: `${stationServiceUrl}/getBusStationViaRouteListv2`,
    detail: `${stationServiceUrl}/busStationInfov2`,
  },
  route: {
    detail: `${routeServiceUrl}/getBusRouteInfoItemv2`,
    stations: `${routeServiceUrl}/getBusRouteStationListv2`,
    search: `${routeServiceUrl}/getBusRouteListv2`,
    line: `${routeServiceUrl}/getBusRouteLineListv2`,
  },
  location: {
    list: `${locationServiceUrl}/getBusLocationListv2`,
  },
  arrival: {
    list: `${arrivalServiceUrl}/getBusArrivalListv2`,
    detail: `${arrivalServiceUrl}/getBusArrivalItemv2`,
  },
} as const;

export type GyeonggiService = keyof typeof gyeonggiEndpoints;
