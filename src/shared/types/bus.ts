export type BusStation = {
  id: string
  name: string
  mobileNo: string | null
  regionName: string
  isCenterLane: boolean
  latitude: number
  longitude: number
}

export type ArrivalVehicle = {
  vehicleId: string
  plateNo: string
  arrivalSeconds: number | null
  remainingStops: number | null
  currentStationName: string | null
  stateCode: number | null
  isLowFloor: boolean | null
}

export type BusArrival = {
  stationId: string
  routeId: string
  routeName: string
  destinationName: string
  stationOrder: number
  routeTypeCode: number
  status: string
  first: ArrivalVehicle | null
  second: ArrivalVehicle | null
  updatedAt: string
}

export type Favorite = {
  id: string
  stationId: string
  stationName: string
  routeId: string
  routeName: string
  destinationName: string
  stationOrder: number
}
