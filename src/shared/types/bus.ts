export type BusStation = {
  id: string;
  name: string;
  mobileNo: string | null;
  regionName: string;
  isCenterLane: boolean;
  latitude: number;
  longitude: number;
  distanceMeters?: number;
};

export type RouteSummary = {
  id: string;
  name: string;
  typeCode: number;
  typeName: string;
  regionName: string;
  adminName: string;
  startStationId: string;
  startStationName: string;
  endStationId: string;
  endStationName: string;
};

export type RouteInfo = RouteSummary & {
  companyName: string | null;
  companyTel: string | null;
  startMobileNo: string | null;
  endMobileNo: string | null;
  upFirstTime: string | null;
  upLastTime: string | null;
  downFirstTime: string | null;
  downLastTime: string | null;
  peakIntervalMinutes: number | null;
  offPeakIntervalMinutes: number | null;
};

export type RouteStation = BusStation & {
  sequence: number;
  turnSequence: number | null;
  isTurnStation: boolean;
};

export type RouteLinePoint = {
  sequence: number;
  latitude: number;
  longitude: number;
};

export type VehicleLocation = {
  routeId: string;
  vehicleId: string;
  plateNo: string;
  stationId: string;
  stationSequence: number;
  routeTypeCode: number;
  stateCode: number;
  isLowFloor: boolean | null;
  remainingSeats: number | null;
  crowdedCode: number | null;
  taglessCode: number | null;
};

export type ArrivalVehicle = {
  vehicleId: string;
  plateNo: string;
  /** 도착까지 남은 초. null이면 도착 예정 없음. */
  arrivalSeconds: number | null;
  remainingStops: number | null;
  currentStationName: string | null;
  currentStationSequence: number | null;
  stateCode: number | null;
  isLowFloor: boolean | null;
  remainingSeats?: number | null;
  crowdedCode?: number | null;
  taglessCode?: number | null;
};

export type BusArrival = {
  stationId: string;
  routeId: string;
  routeName: string;
  destinationName: string;
  stationOrder: number;
  routeTypeCode: number;
  status: string;
  first: ArrivalVehicle | null;
  second: ArrivalVehicle | null;
  updatedAt: string;
};

export type Favorite = {
  id: string;
  station: BusStation;
  routeId: string;
  routeName: string;
  routeTypeCode: number;
  destinationName: string;
  stationOrder: number;
};
