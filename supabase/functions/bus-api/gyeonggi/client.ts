import { BusApiError } from "../errors.ts";
import type { GyeonggiResponse } from "./types.ts";

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
  const { resultCode, resultMessage } = envelope.response.msgHeader;

  if (String(resultCode) !== "0") {
    throw new BusApiError(
      502,
      "UPSTREAM_ERROR",
      `The public bus API rejected the request: ${resultMessage}`,
    );
  }

  return envelope;
}
