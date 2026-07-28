import { useQuery } from '@tanstack/react-query';
import { getNearbyStations } from '@lib/busApi';
import type { Coordinates } from './useCurrentLocation';

export function useNearbyStations(coordinates: Coordinates | null) {
  // 좌표를 약 10m 단위로 묶어 작은 지도 움직임마다 같은 API를 재호출하지 않는다.
  const queryCoordinates = coordinates
    ? {
        latitude: Number(coordinates.latitude.toFixed(4)),
        longitude: Number(coordinates.longitude.toFixed(4)),
      }
    : null;

  return useQuery({
    queryKey: ['nearby-stations', queryCoordinates?.latitude, queryCoordinates?.longitude],
    queryFn: ({ signal }) => {
      if (!queryCoordinates) throw new Error('지도 중심 좌표가 필요합니다.');
      return getNearbyStations(queryCoordinates.latitude, queryCoordinates.longitude, signal);
    },
    enabled: queryCoordinates !== null,
    staleTime: 5 * 60 * 1000,
    select: (response) => response.data.stations,
  });
}
