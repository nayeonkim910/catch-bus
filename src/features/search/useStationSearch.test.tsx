import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { searchStations } from '../../lib/busApi';
import { makeStation } from '../../test/fixtures';
import type { BusStation } from '../../shared/types/bus';
import { useStationSearch } from './useStationSearch';

// 실제 네트워크 대신 검색 API만 대체한다. 나머지 busApi 함수는 원본을 유지한다.
vi.mock('../../lib/busApi', async (importActual) => ({
  ...(await importActual<typeof import('../../lib/busApi')>()),
  searchStations: vi.fn(),
}));

const mockedSearchStations = vi.mocked(searchStations);

type SearchResponse = Awaited<ReturnType<typeof searchStations>>;

function stationResponse(stations: BusStation[]): SearchResponse {
  return { data: { stations }, meta: { updatedAt: '2026-07-27T00:00:00Z' } };
}

function resolveWith(stations: BusStation[]) {
  mockedSearchStations.mockResolvedValue(stationResponse(stations));
}

// 로딩 상태를 관측하기 위해 resolve 시점을 직접 제어하는 promise.
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

// 테스트마다 캐시가 새어나가지 않도록 QueryClient를 매번 새로 만든다.
function renderSearchHook() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderHook(() => useStationSearch(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('useStationSearch', () => {
  it('초기에는 결과 창이 닫혀 있고 조회하지 않는다', () => {
    const { result } = renderSearchHook();

    expect(result.current.isOpen).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.stations).toEqual([]);
    expect(mockedSearchStations).not.toHaveBeenCalled();
  });

  it('검색어를 제출하면 조회 결과가 노출된다', async () => {
    const station = makeStation({ id: 'S1', name: '강남역' });
    resolveWith([station]);
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('강남'));
    act(() => result.current.submitSearch());

    expect(result.current.isOpen).toBe(true);
    await waitFor(() => expect(result.current.stations).toEqual([station]));
    expect(result.current.isLoading).toBe(false);
    expect(mockedSearchStations).toHaveBeenCalledWith('강남', expect.any(AbortSignal));
  });

  it('조회 중에는 isLoading이 true이고 완료되면 false가 된다', async () => {
    const station = makeStation();
    const pending = deferred<SearchResponse>();
    mockedSearchStations.mockReturnValue(pending.promise);
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('강남'));
    act(() => result.current.submitSearch());

    expect(result.current.isLoading).toBe(true);

    pending.resolve(stationResponse([station]));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stations).toEqual([station]);
  });

  it('공백만 입력해 제출하면 조회하지 않는다', () => {
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('   '));
    act(() => result.current.submitSearch());

    expect(result.current.isOpen).toBe(false);
    expect(mockedSearchStations).not.toHaveBeenCalled();
  });

  it('검색어 앞뒤 공백은 잘라내고 조회한다', async () => {
    resolveWith([makeStation()]);
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('  강남  '));
    act(() => result.current.submitSearch());

    await waitFor(() =>
      expect(mockedSearchStations).toHaveBeenCalledWith('강남', expect.any(AbortSignal)),
    );
  });

  it('검색 결과가 없으면 빈 목록으로 결과 창을 연다', async () => {
    resolveWith([]);
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('없는정류장'));
    act(() => result.current.submitSearch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.stations).toEqual([]);
  });

  it('입력을 바꾸면 이전 결과 창이 닫힌다', async () => {
    resolveWith([makeStation()]);
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('강남'));
    act(() => result.current.submitSearch());
    await waitFor(() => expect(result.current.isOpen).toBe(true));

    act(() => result.current.setQuery('역삼'));

    expect(result.current.isOpen).toBe(false);
  });

  it('reset하면 결과 창이 닫힌다', async () => {
    resolveWith([makeStation()]);
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('강남'));
    act(() => result.current.submitSearch());
    await waitFor(() => expect(result.current.isOpen).toBe(true));

    act(() => result.current.reset());

    expect(result.current.isOpen).toBe(false);
  });

  it('조회가 실패하면 isError가 true가 된다', async () => {
    mockedSearchStations.mockRejectedValue(new Error('network error'));
    const { result } = renderSearchHook();

    act(() => result.current.setQuery('강남'));
    act(() => result.current.submitSearch());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isLoading).toBe(false);
  });
});
