import assert from "node:assert/strict";
import { assertUpstreamResult } from "./client.ts";
import { normalizeArrivalList } from "./normalize.ts";
import { BusApiError } from "../errors.ts";
import type { GyeonggiMessageHeader } from "./types.ts";

function header(
  resultCode: number | string,
  resultMessage = "",
): GyeonggiMessageHeader {
  return { queryTime: "2026-07-29 12:00:00.000", resultCode, resultMessage };
}

Deno.test("assertUpstreamResult: 성공 코드(0·200)는 통과한다", () => {
  assertUpstreamResult(header(0, "정상적으로 처리되었습니다."));
  assertUpstreamResult(header("0", "정상적으로 처리되었습니다."));
  assertUpstreamResult(header(200, "성공"));
});

Deno.test("assertUpstreamResult: 4(결과 없음)는 에러가 아니라 통과한다", () => {
  // 도착 예정 버스 없음/검색 결과 없음 등 정상 빈 결과. 이번 fix의 핵심.
  assertUpstreamResult(header(4, "결과가 존재하지 않습니다."));
});

Deno.test("assertUpstreamResult: 비성공 코드는 502 UPSTREAM_ERROR로 던지고 resultCode를 담는다", () => {
  assert.throws(
    () => assertUpstreamResult(header(1, "시스템 에러가 발생하였습니다.")),
    (error: unknown) =>
      error instanceof BusApiError &&
      error.code === "UPSTREAM_ERROR" &&
      error.status === 502 &&
      /resultCode=1/.test(error.message),
  );
  // 통과셋(0·200·4)에 없는 다른 코드도 동일하게 던진다.
  assert.throws(
    () => assertUpstreamResult(header(2, "필수 요청 Parameter 가 존재하지 않습니다.")),
    BusApiError,
  );
});

Deno.test("실제 '결과 없음' 응답(resultCode 4, msgBody 없음) → 통과 후 빈 배열", () => {
  // 포털에서 확인한 실제 응답: resultCode 4에 msgBody 자체가 없다.
  const realHeader = header(4, "결과가 존재하지 않습니다.");
  assertUpstreamResult(realHeader);
  assert.deepEqual(normalizeArrivalList(undefined, realHeader.queryTime), []);
});
