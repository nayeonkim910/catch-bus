import assert from "node:assert/strict";
import { normalizeArrival, normalizeStation } from "./normalize.ts";

const updatedAt = "2026-07-25T10:00:00.000Z";

const validStation = {
  stationId: "228000123",
  stationName: "강남역",
  regionName: "서울",
  centerYn: "N",
  x: "127.0276",
  y: "37.4979",
};

Deno.test("normalizeStation: 객체가 아니면 예외를 던진다", () => {
  assert.throws(() => normalizeStation(null));
  assert.throws(() => normalizeStation("강남역"));
});

Deno.test("normalizeStation: 필수 문자열 필드가 비어 있으면 예외를 던진다", () => {
  assert.throws(() => normalizeStation({ ...validStation, stationName: "" }));
  assert.throws(() =>
    normalizeStation({ ...validStation, stationName: "   " })
  );
});

Deno.test("normalizeStation: centerYn이 Y/N이 아니면 예외를 던진다", () => {
  assert.throws(() => normalizeStation({ ...validStation, centerYn: "X" }));
});

Deno.test("normalizeStation: 좌표가 숫자로 변환 불가능하면 예외를 던진다", () => {
  assert.throws(() => normalizeStation({ ...validStation, x: "not-a-number" }));
});

Deno.test("normalizeStation: 정상 입력은 BusStation으로 정규화한다", () => {
  const station = normalizeStation({ ...validStation, centerYn: "Y" });

  assert.equal(station.id, "228000123");
  assert.equal(station.name, "강남역");
  assert.equal(station.isCenterLane, true);
  assert.equal(station.latitude, 37.4979); // y(문자열) → number
  assert.equal(station.longitude, 127.0276); // x(문자열) → number
});

const validArrival = {
  staOrder: 12,
  stationId: "228000123",
  routeId: "200000001",
  routeName: "360",
  routeDestName: "수원역",
  routeTypeCd: 11,
  flag: "RUN",
};

Deno.test("normalizeArrival: 필수 숫자 필드(staOrder)가 없으면 예외를 던진다", () => {
  assert.throws(() =>
    normalizeArrival(
      {
        stationId: "S1",
        routeId: "R1",
        routeName: "360",
        routeDestName: "수원역",
        routeTypeCd: 11,
        flag: "RUN",
      },
      updatedAt,
    )
  );
});

Deno.test("normalizeArrival: 정상 입력은 BusArrival로 정규화한다 (도착 차량 없으면 first=null)", () => {
  const arrival = normalizeArrival(validArrival, updatedAt);

  assert.equal(arrival.stationOrder, 12);
  assert.equal(arrival.routeName, "360");
  assert.equal(arrival.status, "RUN");
  assert.equal(arrival.first, null); // vehId1이 없으므로 첫차 정보 없음
});
