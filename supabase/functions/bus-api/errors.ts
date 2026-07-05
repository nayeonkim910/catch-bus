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
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  console.error(
    "Unexpected bus-api error",
    error instanceof Error ? error.message : "Unknown error",
  );

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
