import { createFavorite, getFavoriteId } from './favorite';
import { makeArrival, makeStation } from '@test/fixtures';

describe('getFavoriteId', () => {
  it('stationId와 routeId를 콜론으로 결합한다', () => {
    expect(getFavoriteId('S1', 'R1')).toBe('S1:R1');
  });

  it('인자 순서가 결과에 반영된다', () => {
    expect(getFavoriteId('R1', 'S1')).toBe('R1:S1');
  });
});

describe('createFavorite', () => {
  it('station과 arrival에서 필드를 매핑해 Favorite를 만든다', () => {
    const station = makeStation({ id: 'S1', name: '강남역' });
    const arrival = makeArrival({
      routeId: 'R1',
      routeName: '360',
      routeTypeCode: 11,
      destinationName: '수원역',
      stationOrder: 12,
    });

    expect(createFavorite(station, arrival)).toEqual({
      id: 'S1:R1',
      stationId: 'S1',
      stationName: '강남역',
      routeId: 'R1',
      routeName: '360',
      routeTypeCode: 11,
      destinationName: '수원역',
      stationOrder: 12,
    });
  });

  it('id는 getFavoriteId(station.id, arrival.routeId)와 일치한다', () => {
    const station = makeStation({ id: 'S9' });
    const arrival = makeArrival({ routeId: 'R9' });

    expect(createFavorite(station, arrival).id).toBe(getFavoriteId('S9', 'R9'));
  });
});
