import { requestGyeonggiApi } from "./client.ts";
import { gyeonggiEndpoints } from "./endpoints.ts";
import { normalizeVehicleLocations } from "./normalize-location.ts";
import type { BusLocationListBody } from "./types.ts";

export async function getBusLocations(routeId: string) {
  const result = await requestGyeonggiApi<BusLocationListBody>(
    gyeonggiEndpoints.location.list,
    { routeId },
  );
  return {
    locations: normalizeVehicleLocations(
      result.response.msgBody?.busLocationList,
    ),
    updatedAt: result.response.msgHeader.queryTime,
  };
}
