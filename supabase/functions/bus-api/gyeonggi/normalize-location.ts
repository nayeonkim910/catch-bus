import { BusApiError } from "../errors.ts";
import type { VehicleLocation } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalid(field: string): BusApiError {
  return new BusApiError(
    502,
    "UPSTREAM_ERROR",
    `The public bus API returned an invalid vehicle location field: ${field}.`,
  );
}

function requireString(value: unknown, field: string): string {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    String(value).trim() === ""
  ) throw invalid(field);
  return String(value).trim();
}

function requireNumber(value: unknown, field: string): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) throw invalid(field);
  return number;
}

function nullableNumber(value: unknown, field: string): number | null {
  return value === undefined || value === null || value === ""
    ? null
    : requireNumber(value, field);
}

export function normalizeVehicleLocations(value: unknown): VehicleLocation[] {
  if (value === undefined || value === null || value === "") return [];
  const items = Array.isArray(value) ? value : isRecord(value) ? [value] : null;
  if (!items) throw invalid("busLocationList");

  return items.map((item) => {
    if (!isRecord(item)) throw invalid("vehicleLocation");
    const lowFloorCode = nullableNumber(item.lowPlate, "lowPlate");
    return {
      routeId: requireString(item.routeId, "routeId"),
      vehicleId: requireString(item.vehId, "vehId"),
      plateNo: requireString(item.plateNo, "plateNo"),
      stationId: requireString(item.stationId, "stationId"),
      stationSequence: requireNumber(item.stationSeq, "stationSeq"),
      routeTypeCode: requireNumber(item.routeTypeCd, "routeTypeCd"),
      stateCode: requireNumber(item.stateCd, "stateCd"),
      isLowFloor: lowFloorCode === null ? null : lowFloorCode === 1,
      remainingSeats: nullableNumber(item.remainSeatCnt, "remainSeatCnt"),
      crowdedCode: nullableNumber(item.crowded, "crowded"),
      taglessCode: nullableNumber(item.taglessCd, "taglessCd"),
    };
  });
}
