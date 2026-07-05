import { requestGyeonggiApi } from "./client.ts";
import { gyeonggiEndpoints } from "./endpoints.ts";
import { normalizeStationList } from "./normalize.ts";
import type { BusStationAroundListBody, BusStationListBody } from "./types.ts";

export async function searchStations(keyword: string) {
  const result = await requestGyeonggiApi<BusStationListBody>(
    gyeonggiEndpoints.station.search,
    { keyword },
  );

  return {
    stations: normalizeStationList(
      result.response.msgBody?.busStationList,
    ),
    updatedAt: result.response.msgHeader.queryTime,
  };
}

export async function getNearbyStations(longitude: number, latitude: number) {
  const result = await requestGyeonggiApi<BusStationAroundListBody>(
    gyeonggiEndpoints.station.nearby,
    { x: longitude, y: latitude },
  );
  return {
    stations: normalizeStationList(
      result.response.msgBody?.busStationAroundList,
    ),
    updatedAt: result.response.msgHeader.queryTime,
  };
}
