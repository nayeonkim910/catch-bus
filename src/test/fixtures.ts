import type { ArrivalVehicle, BusArrival, BusStation, Favorite } from '../shared/types/bus';

// 테스트용 도메인 객체 팩토리. 기본값 + overrides로 필요한 필드만 바꿔 쓴다.
// as any 없이 타입이 맞는 픽스처를 만들어, 인자 실수를 컴파일 타임에 잡는다.

export function makeStation(overrides: Partial<BusStation> = {}): BusStation {
  return {
    id: 'S1',
    name: '강남역',
    mobileNo: '23278',
    regionName: '서울',
    isCenterLane: false,
    latitude: 37.4979,
    longitude: 127.0276,
    ...overrides,
  };
}

export function makeVehicle(overrides: Partial<ArrivalVehicle> = {}): ArrivalVehicle {
  return {
    vehicleId: 'V1',
    plateNo: '경기70사1234',
    arrivalSeconds: 180,
    remainingStops: 3,
    currentStationName: '역삼역',
    currentStationSequence: 9,
    stateCode: null,
    isLowFloor: false,
    ...overrides,
  };
}

export function makeArrival(overrides: Partial<BusArrival> = {}): BusArrival {
  return {
    stationId: 'S1',
    routeId: 'R1',
    routeName: '360',
    destinationName: '수원역',
    stationOrder: 12,
    routeTypeCode: 11,
    status: 'RUN',
    first: makeVehicle(),
    second: null,
    updatedAt: '2026-07-25T10:00:00.000Z',
    ...overrides,
  };
}

export function makeFavorite(overrides: Partial<Favorite> = {}): Favorite {
  return {
    id: 'S1:R1',
    stationId: 'S1',
    stationName: '강남역',
    routeId: 'R1',
    routeName: '360',
    routeTypeCode: 11,
    destinationName: '수원역',
    stationOrder: 12,
    ...overrides,
  };
}
