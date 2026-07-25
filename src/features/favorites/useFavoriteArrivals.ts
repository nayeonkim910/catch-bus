import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { stationArrivalsQueryOptions } from "../../lib/busQueries";
import type { BusArrival, Favorite } from "../../shared/types/bus";
import { getFavoriteId } from "./favorite";

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
 * 정류장별 조회 결과를 즐겨찾기 단위로 색인해, getEntry로 각 즐겨찾기의 도착정보·상태를 O(1)로 얻게 한다.
 * 순수 함수. 앱은 useFavoriteArrivals 훅만 쓰며, export는 단위 테스트용이다.
 */
export function buildFavoriteArrivals(
  stationIds: string[],
  results: StationArrivalsResult[],
): FavoriteArrivals {
  // 도착정보는 노선 단위, 로딩·에러는 정류장 단위라 맵을 둘로 나눈다.
  const arrivalByFavoriteId = new Map<string, BusArrival>();
  const statusByStation = new Map<string, StationArrivalsResult>();

  results.forEach((result, index) => {
    statusByStation.set(stationIds[index], result);
    for (const arrival of result.data ?? []) {
      arrivalByFavoriteId.set(
        getFavoriteId(arrival.stationId, arrival.routeId),
        arrival,
      );
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
}

/**
 * 즐겨찾기 목록의 도착정보를 정류장 단위로 조회한다.
 * 같은 정류장은 중복 제거해 한 번만 조회하고, getEntry로 각 즐겨찾기가 자신의 도착정보·상태를 얻는다.
 */
export function useFavoriteArrivals(favorites: Favorite[]): FavoriteArrivals {
  const stationIds = useMemo(
    () => [...new Set(favorites.map((favorite) => favorite.stationId))],
    [favorites],
  );

  // 조립은 순수 함수에 위임하고, 조회 결과가 바뀔 때만 다시 만들도록 최적화한다.
  const combine = useCallback(
    (results: StationArrivalsResult[]) =>
      buildFavoriteArrivals(stationIds, results),
    [stationIds],
  );

  return useQueries({
    queries: stationIds.map((stationId) =>
      stationArrivalsQueryOptions(stationId)
    ),
    combine,
  });
}
