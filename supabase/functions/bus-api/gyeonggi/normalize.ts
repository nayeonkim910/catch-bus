import { BusApiError } from "../errors.ts";
import type {
  ArrivalVehicle,
  BusArrival,
  BusStation,
  RawBusStation,
} from "./types.ts";
import { calculateCurrentStationSequence } from "./arrival-sequence.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw invalidField(field);
  }

  return value.trim();
}

function requireStringOrNumber(value: unknown, field: string): string {
  if (
    !((typeof value === "string" && value.trim() !== "") ||
      (typeof value === "number" && Number.isFinite(value)))
  ) {
    throw invalidField(field);
  }

  return String(value).trim();
}

function requireNumber(value: unknown, field: string): number {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    throw invalidField(field);
  }

  return parsed;
}

function invalidField(field: string): BusApiError {
  return new BusApiError(
    502,
    "UPSTREAM_ERROR",
    `The public bus API returned an invalid field: ${field}.`,
  );
}

export function normalizeStation(value: unknown): BusStation {
  if (!isRecord(value)) {
    throw invalidField("station");
  }

  const centerYn = requireString(value.centerYn, "centerYn");

  if (centerYn !== "Y" && centerYn !== "N") {
    throw invalidField("centerYn");
  }

  const mobileNo = typeof value.mobileNo === "string"
    ? value.mobileNo.trim() || null
    : null;

  return {
    id: requireStringOrNumber(value.stationId, "stationId"),
    name: requireString(value.stationName, "stationName"),
    mobileNo,
    regionName: requireString(value.regionName, "regionName"),
    isCenterLane: centerYn === "Y",
    latitude: requireNumber(value.y, "y"),
    longitude: requireNumber(value.x, "x"),
    ...(value.distance === undefined || value.distance === null ||
        value.distance === ""
      ? {}
      : { distanceMeters: requireNumber(value.distance, "distance") }),
  };
}

export function normalizeStationList(value: unknown): BusStation[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new BusApiError(
      502,
      "UPSTREAM_ERROR",
      "The public bus API returned an invalid station list.",
    );
  }

  return value.map(normalizeStation);
}

function optionalNumber(value: unknown, field: string): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return requireNumber(value, field);
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() || null : null;
}

function normalizeArrivalVehicle(
  value: Record<string, unknown>,
  index: 1 | 2,
  targetStationSequence: number,
): ArrivalVehicle | null {
  const vehicleId = value[`vehId${index}`];

  if (vehicleId === undefined || vehicleId === null || vehicleId === "") {
    return null;
  }

  const seconds = optionalNumber(
    value[`predictTimeSec${index}`],
    `predictTimeSec${index}`,
  );
  const minutes = optionalNumber(
    value[`predictTime${index}`],
    `predictTime${index}`,
  );
  const lowFloorCode = optionalNumber(
    value[`lowPlate${index}`],
    `lowPlate${index}`,
  );
  const remainingStops = optionalNumber(
    value[`locationNo${index}`],
    `locationNo${index}`,
  );

  return {
    vehicleId: requireStringOrNumber(vehicleId, `vehId${index}`),
    plateNo: optionalString(value[`plateNo${index}`]) ?? "",
    arrivalSeconds: seconds ?? (minutes === null ? null : minutes * 60),
    remainingStops,
    currentStationName: optionalString(value[`stationNm${index}`]),
    currentStationSequence: calculateCurrentStationSequence(
      targetStationSequence,
      remainingStops,
    ),
    stateCode: optionalNumber(value[`stateCd${index}`], `stateCd${index}`),
    isLowFloor: lowFloorCode === null ? null : lowFloorCode === 1,
    remainingSeats: optionalNumber(
      value[`remainSeatCnt${index}`],
      `remainSeatCnt${index}`,
    ),
    crowdedCode: optionalNumber(
      value[`crowded${index}`],
      `crowded${index}`,
    ),
    taglessCode: optionalNumber(
      value[`taglessCd${index}`],
      `taglessCd${index}`,
    ),
  };
}

export function normalizeArrival(
  value: unknown,
  updatedAt: string,
): BusArrival {
  if (!isRecord(value)) {
    throw new BusApiError(
      502,
      "UPSTREAM_ERROR",
      "The public bus API returned an invalid arrival item.",
    );
  }

  const stationOrder = requireNumber(value.staOrder, "staOrder");

  return {
    stationId: requireStringOrNumber(value.stationId, "stationId"),
    routeId: requireStringOrNumber(value.routeId, "routeId"),
    routeName: requireStringOrNumber(value.routeName, "routeName"),
    destinationName: requireString(value.routeDestName, "routeDestName"),
    stationOrder,
    routeTypeCode: requireNumber(value.routeTypeCd, "routeTypeCd"),
    status: requireString(value.flag, "flag"),
    first: normalizeArrivalVehicle(value, 1, stationOrder),
    second: normalizeArrivalVehicle(value, 2, stationOrder),
    updatedAt,
  };
}

export function normalizeArrivalList(
  value: unknown,
  updatedAt: string,
): BusArrival[] {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeArrival(item, updatedAt));
  }

  if (isRecord(value)) {
    if (Object.keys(value).length === 0) {
      return [];
    }

    return [normalizeArrival(value, updatedAt)];
  }

  throw new BusApiError(
    502,
    "UPSTREAM_ERROR",
    "The public bus API returned an invalid arrival list.",
  );
}

export type { RawBusStation };
