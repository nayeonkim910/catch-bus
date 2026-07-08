import assert from "node:assert/strict";
import { calculateCurrentStationSequence } from "./arrival-sequence.ts";

Deno.test("남은 정류장 수로 현재 정류장 순번을 계산한다", () => {
  assert.equal(calculateCurrentStationSequence(20, 3), 17);
});

Deno.test("버스가 도착 대상 정류장에 있으면 대상 순번을 반환한다", () => {
  assert.equal(calculateCurrentStationSequence(20, 0), 20);
});

Deno.test("계산에 필요한 값이 없으면 현재 순번을 만들지 않는다", () => {
  assert.equal(calculateCurrentStationSequence(20, null), null);
});

Deno.test("공공 API가 유효하지 않은 정류장 수를 반환하면 현재 순번을 만들지 않는다", () => {
  assert.equal(calculateCurrentStationSequence(20, -1), null);
  assert.equal(calculateCurrentStationSequence(20, 1.5), null);
});

Deno.test("계산 결과가 노선의 첫 순번보다 작으면 현재 순번을 만들지 않는다", () => {
  assert.equal(calculateCurrentStationSequence(3, 3), null);
  assert.equal(calculateCurrentStationSequence(3, 4), null);
});

Deno.test("도착 대상 정류장 순번이 정수가 아니면 현재 순번을 만들지 않는다", () => {
  assert.equal(calculateCurrentStationSequence(20.5, 3), null);
  assert.equal(calculateCurrentStationSequence(Number.NaN, 3), null);
});
