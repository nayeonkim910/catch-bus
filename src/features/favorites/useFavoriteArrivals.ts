import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { stationArrivalsQueryOptions } from '../../lib/busQueries';
import type { BusArrival, Favorite } from '../../shared/types/bus';
import { getFavoriteId } from './favorite';

export type FavoriteArrivalEntry = {
  /** 즐겨찾기의 정류장·노선에 해당하는 도착정보. 아직 없거나 운행 정보가 없으면 undefined. */
  arrival: BusArrival | undefined;
  /** 해당 정류장 도착정보를 아직 한 번도 받지 못했는지. */
  isLoading: boolean;
  /** 해당 정류장 도착정보 조회가 실패했는지. */
  isError: boolean;
};

export type FavoriteArrivals = {
  getEntry: (favorite: Favorite) => FavoriteArrivalEntry;
};

type StationArrivalsResult = UseQueryResult<BusArrival[]>;

/**
 * 즐겨찾기 목록의 도착정보를 정류장 단위로 조회한다.
 *
 * 현재 선택한 정류장의 도착정보에 의존하지 않고, 각 즐겨찾기가 자신의 정류장
 * 도착정보를 독립적으로 확인할 수 있게 한다. 같은 정류장을 저장한 즐겨찾기는
 * `stationId`로 중복을 제거해 도착정보를 한 번만 조회하고, 각 즐겨찾기는
 * `getEntry`로 자신의 도착정보와 로딩·에러 상태를 O(1)로 얻는다.
 */
export function useFavoriteArrivals(favorites: Favorite[]): FavoriteArrivals {
  const stationIds = useMemo(
    () => [...new Set(favorites.map((favorite) => favorite.stationId))],
    [favorites],
  );

  // combine을 메모이즈해 매 렌더가 아니라 조회 결과가 바뀔 때만 조회 맵을 다시 만든다.
  const combine = useCallback(
    (results: StationArrivalsResult[]): FavoriteArrivals => {
      // 노선 단위 도착정보 조회 맵과 정류장 단위 로딩·에러 상태 맵을 함께 만든다.
      const arrivalByFavoriteId = new Map<string, BusArrival>();
      const statusByStation = new Map<string, StationArrivalsResult>();

      results.forEach((result, index) => {
        statusByStation.set(stationIds[index], result);
        for (const arrival of result.data ?? []) {
          arrivalByFavoriteId.set(getFavoriteId(arrival.stationId, arrival.routeId), arrival);
        }
      });

      return {
        getEntry: (favorite) => {
          const status = statusByStation.get(favorite.stationId);
          return {
            arrival: arrivalByFavoriteId.get(favorite.id),
            isLoading: status?.isLoading ?? false,
            isError: status?.isError ?? false,
          };
        },
      };
    },
    [stationIds],
  );

  return useQueries({
    queries: stationIds.map((stationId) => stationArrivalsQueryOptions(stationId)),
    combine,
  });
}
