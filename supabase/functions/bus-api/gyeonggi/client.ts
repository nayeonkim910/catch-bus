import { BusApiError } from "../errors.ts";
import type { GyeonggiMessageHeader, GyeonggiResponse } from "./types.ts";

const API_KEY_ENV_NAME = "GYEONGGI_BUS_API_KEY";
const REQUEST_TIMEOUT_MS = 8_000;

type QueryValue = string | number;

function getApiKey(): string {
  const apiKey = Deno.env.get(API_KEY_ENV_NAME)?.trim();

  if (!apiKey) {
    throw new BusApiError(
      500,
      "CONFIGURATION_ERROR",
      "The bus API is not configured.",
    );
  }

  return apiKey;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseEnvelope<TBody>(value: unknown): GyeonggiResponse<TBody> {
  if (!isRecord(value) || !isRecord(value.response)) {
    throw new BusApiError(
      502,
      "UPSTREAM_ERROR",
      "The public bus API returned an invalid response.",
    );
  }

  const { msgHeader } = value.response;

  if (
    !isRecord(msgHeader) ||
    !(typeof msgHeader.resultCode === "number" ||
      typeof msgHeader.resultCode === "string") ||
    typeof msgHeader.resultMessage !== "string" ||
    typeof msgHeader.queryTime !== "string"
  ) {
    throw new BusApiError(
      502,
      "UPSTREAM_ERROR",
      "The public bus API returned an invalid message header.",
    );
  }

  return value as GyeonggiResponse<TBody>;
}

// 경기도 공공데이터포털 resultCode: 0·200=성공, 4=결과없음(정상 빈 결과)이라 통과시키고
// 하위 normalize가 빈 배열로 처리한다. 그 외(1=시스템에러, 2=파라미터누락 등)만 업스트림 실패로 던진다.
const PASSTHROUGH_RESULT_CODES = new Set(["0", "200", "4"]);

export function assertUpstreamResult(header: GyeonggiMessageHeader): void {
  const code = String(header.resultCode);
  if (PASSTHROUGH_RESULT_CODES.has(code)) return;

  throw new BusApiError(
    502,
    "UPSTREAM_ERROR",
    `The public bus API rejected the request (resultCode=${code}): ${header.resultMessage}`,
  );
}

export async function requestGyeonggiApi<TBody>(
  endpoint: string,
  query: Record<string, QueryValue>,
): Promise<GyeonggiResponse<TBody>> {
  const url = new URL(endpoint);
  const searchParams = new URLSearchParams({
    serviceKey: getApiKey(),
    format: "json",
  });

  for (const [key, value] of Object.entries(query)) {
    searchParams.set(key, String(value));
  }

  url.search = searchParams.toString();

  let response: Response;

  try {
    response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "TimeoutError"
        ? "The public bus API request timed out."
        : "The public bus API could not be reached.";

    throw new BusApiError(502, "UPSTREAM_ERROR", message);
  }

  if (!response.ok) {
    throw new BusApiError(
      502,
      "UPSTREAM_ERROR",
      `The public bus API returned HTTP ${response.status}.`,
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new BusApiError(
      502,
      "UPSTREAM_ERROR",
      "The public bus API returned invalid JSON.",
    );
  }

  const envelope = parseEnvelope<TBody>(payload);
  assertUpstreamResult(envelope.response.msgHeader);

  return envelope;
}
