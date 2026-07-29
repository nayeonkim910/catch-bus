import assert from "node:assert/strict";
import { BusApiError, errorResponse } from "./errors.ts";

type LogCall = { level: "error" | "warn"; args: unknown[] };

// console.error/warn을 가로채 어떤 레벨로 무엇이 로깅됐는지 확인한다.
function captureConsole() {
  const calls: LogCall[] = [];
  const origError = console.error;
  const origWarn = console.warn;
  console.error = (...args: unknown[]) => calls.push({ level: "error", args });
  console.warn = (...args: unknown[]) => calls.push({ level: "warn", args });
  const restore = () => {
    console.error = origError;
    console.warn = origWarn;
  };
  return { calls, restore };
}

Deno.test("errorResponse: 5xx BusApiError는 console.error로 로깅하고 응답 계약을 유지한다", async () => {
  const { calls, restore } = captureConsole();
  try {
    const res = errorResponse(
      new BusApiError(502, "UPSTREAM_ERROR", "invalid field: routeName"),
    );

    // 응답 계약(프론트가 실제로 의존): status + error.code
    assert.equal(res.status, 502);
    const body = await res.json();
    assert.equal(body.error.code, "UPSTREAM_ERROR");

    // 로깅은 레벨(error)과 구조화 로그에 code가 담겼는지만 확인한다. 로그는 계약이 아니라
    // 필드를 자유롭게 늘릴 수 있으므로(예: endpoint 추가) 전체 shape를 고정하지 않는다(change-detector 방지).
    assert.equal(calls[0].level, "error");
    assert.equal((calls[0].args[1] as { code: string }).code, "UPSTREAM_ERROR");
  } finally {
    restore();
  }
});

Deno.test("errorResponse: 4xx BusApiError는 console.warn으로 로깅한다(노이즈 분리)", () => {
  const { calls, restore } = captureConsole();
  try {
    const res = errorResponse(new BusApiError(400, "BAD_REQUEST", "query is required."));

    assert.equal(res.status, 400);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].level, "warn");
  } finally {
    restore();
  }
});

Deno.test("errorResponse: 예상 못한 에러는 INTERNAL_ERROR(500)로 감싸고 스택까지 로깅한다", () => {
  const { calls, restore } = captureConsole();
  try {
    const res = errorResponse(new Error("boom"));

    assert.equal(res.status, 500);
    assert.equal(calls[0].level, "error");
    // 예상 못한 에러는 스택이 유일한 단서 → payload에 message + stack이 담겨야 한다.
    const payload = calls[0].args[1] as { message: string; stack?: string };
    assert.equal(payload.message, "boom");
    assert.match(payload.stack ?? "", /Error: boom/);
  } finally {
    restore();
  }
});
