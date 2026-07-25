import type { UseQueryResult } from "@tanstack/react-query";
import { buildFavoriteArrivals } from "./useFavoriteArrivals";
import { makeArrival, makeFavorite } from "../../test/fixtures";
import type { BusArrival } from "../../shared/types/bus";

type StationResult = UseQueryResult<BusArrival[]>;

// buildFavoriteArrivals는 data/isLoading/isError만 읽으므로, 그 부분만 채워
// 한 곳에서만 캐스팅한다(테스트마다 as any를 흩지 않는다).
function stationResult(partial: Partial<StationResult>): StationResult {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    ...partial,
  } as StationResult;
}

describe("buildFavoriteArrivals", () => {
  it("같은 정류장의 여러 노선이 각자 자기 도착정보를 얻는다", () => {
    const bus360 = makeArrival({ stationId: "S1", routeId: "R360" });
    const bus402 = makeArrival({ stationId: "S1", routeId: "R402" });

    const arrivals = buildFavoriteArrivals(["S1"], [
      stationResult({ data: [bus360, bus402] }),
    ]);

    expect(
      arrivals.getEntry(
        makeFavorite({ id: "S1:R360", stationId: "S1", routeId: "R360" }),
      ).arrival,
    ).toBe(
      bus360,
    );
    expect(
      arrivals.getEntry(
        makeFavorite({ id: "S1:R402", stationId: "S1", routeId: "R402" }),
      ).arrival,
    ).toBe(
      bus402,
    );
  });

  it("도착정보가 없는 즐겨찾기는 arrival이 undefined다", () => {
    const arrivals = buildFavoriteArrivals(["S1"], [
      stationResult({ data: [] }),
    ]);

    const entry = arrivals.getEntry(
      makeFavorite({ id: "S1:R1", stationId: "S1", routeId: "R1" }),
    );

    expect(entry.arrival).toBeUndefined();
  });

  it("정류장 쿼리의 로딩·에러 상태를 그 정류장 즐겨찾기에 전달한다", () => {
    const arrivals = buildFavoriteArrivals(
      ["S1", "S2"],
      [stationResult({ isLoading: true }), stationResult({ isError: true })],
    );

    const s1 = arrivals.getEntry(makeFavorite({ stationId: "S1" }));
    const s2 = arrivals.getEntry(makeFavorite({ stationId: "S2" }));

    expect(s1.isLoading).toBe(true);
    expect(s1.isError).toBe(false);
    expect(s2.isLoading).toBe(false);
    expect(s2.isError).toBe(true);
  });
});
