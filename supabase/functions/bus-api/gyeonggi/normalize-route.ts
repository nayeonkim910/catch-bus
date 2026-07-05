import { BusApiError } from "../errors.ts";
import type {
  RouteInfo,
  RouteLinePoint,
  RouteStation,
  RouteSummary,
} from "./types.ts";

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalid(field: string): BusApiError {
  return new BusApiError(
    502,
    "UPSTREAM_ERROR",
    `The public bus API returned an invalid route field: ${field}.`,
  );
}

function requireString(value: unknown, field: string): string {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    String(value).trim() === ""
  ) {
    throw invalid(field);
  }
  return String(value).trim();
}

function requireNumber(value: unknown, field: string): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) throw invalid(field);
  return number;
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" || typeof value === "number"
    ? String(value).trim() || null
    : null;
}

function nullableNumber(value: unknown, field: string): number | null {
  return value === undefined || value === null || value === ""
    ? null
    : requireNumber(value, field);
}

function collection(value: unknown, label: string): unknown[] {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (isRecord(value)) return Object.keys(value).length === 0 ? [] : [value];
  throw invalid(label);
}

function routeSummary(value: unknown): RouteSummary {
  if (!isRecord(value)) throw invalid("route");
  return {
    id: requireString(value.routeId, "routeId"),
    name: requireString(value.routeName, "routeName"),
    typeCode: requireNumber(value.routeTypeCd, "routeTypeCd"),
    typeName: requireString(value.routeTypeName, "routeTypeName"),
    regionName: requireString(value.regionName, "regionName"),
    adminName: requireString(value.adminName, "adminName"),
    startStationId: requireString(value.startStationId, "startStationId"),
    startStationName: requireString(value.startStationName, "startStationName"),
    endStationId: requireString(value.endStationId, "endStationId"),
    endStationName: requireString(value.endStationName, "endStationName"),
  };
}

export function normalizeRouteList(value: unknown): RouteSummary[] {
  return collection(value, "busRouteList").map(routeSummary);
}

export function normalizeRouteInfo(value: unknown): RouteInfo {
  if (!isRecord(value)) throw invalid("busRouteInfoItem");
  return {
    ...routeSummary(value),
    companyName: nullableString(value.companyName),
    companyTel: nullableString(value.companyTel),
    startMobileNo: nullableString(value.startMobileNo),
    endMobileNo: nullableString(value.endMobileNo),
    upFirstTime: nullableString(value.upFirstTime),
    upLastTime: nullableString(value.upLastTime),
    downFirstTime: nullableString(value.downFirstTime),
    downLastTime: nullableString(value.downLastTime),
    peakIntervalMinutes: nullableNumber(value.peekAlloc, "peekAlloc"),
    offPeakIntervalMinutes: nullableNumber(value.nPeekAlloc, "nPeekAlloc"),
  };
}

export function normalizeRouteStations(value: unknown): RouteStation[] {
  return collection(value, "busRouteStationList").map((item) => {
    if (!isRecord(item)) throw invalid("routeStation");
    const centerYn = requireString(item.centerYn, "centerYn");
    const turnYn = requireString(item.turnYn, "turnYn");
    return {
      id: requireString(item.stationId, "stationId"),
      name: requireString(item.stationName, "stationName"),
      mobileNo: nullableString(item.mobileNo),
      regionName: requireString(item.regionName, "regionName"),
      isCenterLane: centerYn === "Y",
      latitude: requireNumber(item.y, "y"),
      longitude: requireNumber(item.x, "x"),
      sequence: requireNumber(item.stationSeq, "stationSeq"),
      turnSequence: nullableNumber(item.turnSeq, "turnSeq"),
      isTurnStation: turnYn === "Y",
    };
  });
}

export function normalizeRouteLine(value: unknown): RouteLinePoint[] {
  return collection(value, "busRouteLineList").map((item) => {
    if (!isRecord(item)) throw invalid("routeLinePoint");
    return {
      sequence: requireNumber(item.lineSeq, "lineSeq"),
      latitude: requireNumber(item.y, "y"),
      longitude: requireNumber(item.x, "x"),
    };
  });
}
