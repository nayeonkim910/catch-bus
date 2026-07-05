import { requestGyeonggiApi } from "./client.ts";
import { gyeonggiEndpoints } from "./endpoints.ts";
import { normalizeArrivalList } from "./normalize.ts";
import type { BusArrivalListBody } from "./types.ts";

export async function getStationArrivals(stationId: string) {
  const result = await requestGyeonggiApi<BusArrivalListBody>(
    gyeonggiEndpoints.arrival.list,
    { stationId },
  );
  const updatedAt = result.response.msgHeader.queryTime;

  return {
    arrivals: normalizeArrivalList(
      result.response.msgBody?.busArrivalList,
      updatedAt,
    ),
    updatedAt,
  };
}
