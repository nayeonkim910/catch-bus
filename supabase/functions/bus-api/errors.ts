export type BusApiErrorCode =
  | "BAD_REQUEST"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "CONFIGURATION_ERROR"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

export class BusApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: BusApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "BusApiError";
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof BusApiError) {
    const log = error.status >= 500 ? console.error : console.warn;
    log("BusApiError", {
      code: error.code,
      status: error.status,
      message: error.message,
    });

    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  console.error("Unexpected bus-api error", {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    { status: 500 },
  );
}
