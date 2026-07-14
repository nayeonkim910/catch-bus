import type { BusArrival, BusStation, Favorite } from '../../shared/types/bus';

export function getFavoriteId(stationId: string, routeId: string) {
  return `${stationId}:${routeId}`;
}

export function createFavorite(station: BusStation, arrival: BusArrival): Favorite {
  return {
    id: getFavoriteId(station.id, arrival.routeId),
    stationId: station.id,
    stationName: station.name,
    routeId: arrival.routeId,
    routeName: arrival.routeName,
    routeTypeCode: arrival.routeTypeCode,
    destinationName: arrival.destinationName,
    stationOrder: arrival.stationOrder,
  };
}
