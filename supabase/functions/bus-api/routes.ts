import { BusApiError } from "./errors.ts";
import { getStationArrivals } from "./gyeonggi/arrivals.ts";
import { getBusLocations } from "./gyeonggi/locations.ts";
import {
  getRouteInfo,
  getRouteLine,
  getRouteStations,
  searchRoutes,
} from "./gyeonggi/routes.ts";
import { getNearbyStations, searchStations } from "./gyeonggi/stations.ts";

const MAX_SEARCH_QUERY_LENGTH = 50;

function getSearchQuery(url: URL): string {
  const query = url.searchParams.get("query")?.trim() ?? "";

  if (!query) {
    throw new BusApiError(400, "BAD_REQUEST", "query is required.");
  }

  if (query.length > MAX_SEARCH_QUERY_LENGTH) {
    throw new BusApiError(
      400,
      "BAD_REQUEST",
      `query must be ${MAX_SEARCH_QUERY_LENGTH} characters or fewer.`,
    );
  }

  return query;
}

function getStationId(url: URL): string {
  const stationId = url.searchParams.get("stationId")?.trim() ?? "";

  if (!/^\d{1,20}$/.test(stationId)) {
    throw new BusApiError(
      400,
      "BAD_REQUEST",
      "stationId must contain 1 to 20 digits.",
    );
  }

  return stationId;
}

function getRouteId(url: URL): string {
  const routeId = url.searchParams.get("routeId")?.trim() ?? "";
  if (!/^\d{1,20}$/.test(routeId)) {
    throw new BusApiError(
      400,
      "BAD_REQUEST",
      "routeId must contain 1 to 20 digits.",
    );
  }
  return routeId;
}

function getCoordinate(url: URL, name: "latitude" | "longitude"): number {
  const value = Number(url.searchParams.get(name));
  const valid = Number.isFinite(value) &&
    (name === "latitude"
      ? value >= -90 && value <= 90
      : value >= -180 && value <= 180);
  if (!valid) throw new BusApiError(400, "BAD_REQUEST", `${name} is invalid.`);
  return value;
}

export async function handleBusApiRequest(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    throw new BusApiError(
      405,
      "METHOD_NOT_ALLOWED",
      "Only GET requests are supported.",
    );
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "search-stations") {
    const result = await searchStations(getSearchQuery(url));

    return Response.json({
      data: { stations: result.stations },
      meta: { updatedAt: result.updatedAt },
    });
  }

  if (action === "station-arrivals") {
    const result = await getStationArrivals(getStationId(url));

    return Response.json({
      data: { arrivals: result.arrivals },
      meta: { updatedAt: result.updatedAt },
    });
  }

  if (action === "nearby-stations") {
    const result = await getNearbyStations(
      getCoordinate(url, "longitude"),
      getCoordinate(url, "latitude"),
    );
    return Response.json({
      data: { stations: result.stations },
      meta: { updatedAt: result.updatedAt },
    });
  }

  if (action === "search-routes") {
    const result = await searchRoutes(getSearchQuery(url));
    return Response.json({
      data: { routes: result.routes },
      meta: { updatedAt: result.updatedAt },
    });
  }

  if (action === "route-info") {
    const result = await getRouteInfo(getRouteId(url));
    return Response.json({
      data: { route: result.route },
      meta: { updatedAt: result.updatedAt },
    });
  }

  if (action === "route-stations") {
    const result = await getRouteStations(getRouteId(url));
    return Response.json({
      data: { stations: result.stations },
      meta: { updatedAt: result.updatedAt },
    });
  }

  if (action === "route-line") {
    const result = await getRouteLine(getRouteId(url));
    return Response.json({
      data: { points: result.points },
      meta: { updatedAt: result.updatedAt },
    });
  }

  if (action === "bus-locations") {
    const result = await getBusLocations(getRouteId(url));
    return Response.json({
      data: { locations: result.locations },
      meta: { updatedAt: result.updatedAt },
    });
  }

  throw new BusApiError(
    404,
    "NOT_FOUND",
    "The requested bus API action was not found.",
  );
}
