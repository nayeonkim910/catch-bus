import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArrivalCard } from './ArrivalCard';
import { useFavoritesStore } from '../favorites/favoritesStore';
import { makeArrival, makeStation } from '../../test/fixtures';

// 상세 노선 조회(TanStack Query)는 이 컴포넌트 테스트의 관심사가 아니므로 대체한다.
// → QueryClientProvider 없이 즐겨찾기 상호작용만 격리해 검증한다.
vi.mock('../routes/useRouteStationData', () => ({
  useRouteStationData: () => ({ data: undefined, isLoading: false }),
}));

beforeEach(() => {
  // Zustand persist store는 모듈 싱글턴이라 테스트 간 상태를 초기화한다.
  localStorage.clear();
  useFavoritesStore.setState({ favorites: [] });
});

function renderCard(onSelectRoute = vi.fn()) {
  const station = makeStation({ id: 'S1', name: '강남역' });
  const arrival = makeArrival({ stationId: 'S1', routeId: 'R1', routeName: '360' });
  render(
    <ArrivalCard
      station={station}
      arrival={arrival}
      isRouteSelected={false}
      onSelectRoute={onSelectRoute}
    />,
  );
  return { user: userEvent.setup(), onSelectRoute };
}

describe('ArrivalCard 즐겨찾기', () => {
  it('즐겨찾기가 아니면 별 버튼이 "추가" 상태다', () => {
    renderCard();

    expect(screen.getByRole('button', { name: /즐겨찾기 추가/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('별 버튼을 누르면 즐겨찾기에 추가되고 버튼 상태가 바뀐다', async () => {
    const { user } = renderCard();

    await user.click(screen.getByRole('button', { name: /즐겨찾기 추가/ }));

    // 라벨이 "삭제"로 바뀌고 눌림 상태가 된다.
    expect(screen.getByRole('button', { name: /즐겨찾기 삭제/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    // store에도 실제로 저장된다.
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
  });

  it('별 버튼 클릭은 stopPropagation으로 카드 선택(onSelectRoute)을 부르지 않는다', async () => {
    const { user, onSelectRoute } = renderCard();

    await user.click(screen.getByRole('button', { name: /즐겨찾기/ }));

    expect(onSelectRoute).not.toHaveBeenCalled();
  });

  it('카드 본문 클릭은 onSelectRoute를 부른다', async () => {
    const { user, onSelectRoute } = renderCard();

    await user.click(screen.getByRole('button', { name: /지도에서 보기/ }));

    expect(onSelectRoute).toHaveBeenCalledTimes(1);
  });
});
