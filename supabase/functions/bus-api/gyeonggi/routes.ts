import { requestGyeonggiApi } from "./client.ts";
import { gyeonggiEndpoints } from "./endpoints.ts";
import {
  normalizeRouteInfo,
  normalizeRouteLine,
  normalizeRouteList,
  normalizeRouteStations,
} from "./normalize-route.ts";
import type {
  BusRouteInfoBody,
  BusRouteLineListBody,
  BusRouteListBody,
  BusRouteStationListBody,
} from "./types.ts";

export async function searchRoutes(keyword: string) {
  const result = await requestGyeonggiApi<BusRouteListBody>(
    gyeonggiEndpoints.route.search,
    { keyword },
  );
  return {
    routes: normalizeRouteList(result.response.msgBody?.busRouteList),
    updatedAt: result.response.msgHeader.queryTime,
  };
}

export async function getRouteInfo(routeId: string) {
  const result = await requestGyeonggiApi<BusRouteInfoBody>(
    gyeonggiEndpoints.route.detail,
    { routeId },
  );
  return {
    route: normalizeRouteInfo(result.response.msgBody?.busRouteInfoItem),
    updatedAt: result.response.msgHeader.queryTime,
  };
}

export async function getRouteStations(routeId: string) {
  const result = await requestGyeonggiApi<BusRouteStationListBody>(
    gyeonggiEndpoints.route.stations,
    { routeId },
  );
  return {
    stations: normalizeRouteStations(
      result.response.msgBody?.busRouteStationList,
    ),
    updatedAt: result.response.msgHeader.queryTime,
  };
}

export async function getRouteLine(routeId: string) {
  const result = await requestGyeonggiApi<BusRouteLineListBody>(
    gyeonggiEndpoints.route.line,
    { routeId },
  );
  return {
    points: normalizeRouteLine(result.response.msgBody?.busRouteLineList),
    updatedAt: result.response.msgHeader.queryTime,
  };
}
