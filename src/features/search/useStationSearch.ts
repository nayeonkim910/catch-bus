import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchStationsQueryOptions } from '../../lib/busQueries';
import type { BusStation } from '../../shared/types/bus';

export type StationSearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; stations: BusStation[] }
  | { status: 'error'; message: string };

const EMPTY_QUERY_MESSAGE = '검색어를 입력해 주세요.';
const SEARCH_FAILED_MESSAGE = '정류장을 검색하지 못했어요. 잠시 후 다시 시도해 주세요.';

export function useStationSearch() {
  const [query, setQueryState] = useState('');
  // 입력값(query)과 분리된 '제출된 검색어'. 이 값이 바뀔 때만 조회가 나간다.
  const [submittedQuery, setSubmittedQuery] = useState('');
  // 빈 검색어 안내는 서버 상태가 아니므로 로컬 UI 상태로 둔다.
  const [isEmptyQuery, setIsEmptyQuery] = useState(false);

  const { data, isPending, isError } = useQuery({
    ...searchStationsQueryOptions(submittedQuery),
    enabled: submittedQuery.length > 0,
  });

  // 제출 여부(submittedQuery)를 먼저 보고, 그다음 Query 상태를 화면용 상태로 매핑한다.
  // 제출 전에는 enabled:false라 isPending이 true이므로, 그 값에 앞서 idle로 처리해야 한다.
  function resolveSearchState(): StationSearchState {
    if (isEmptyQuery) return { status: 'error', message: EMPTY_QUERY_MESSAGE };
    if (submittedQuery.length === 0) return { status: 'idle' };
    if (isError) return { status: 'error', message: SEARCH_FAILED_MESSAGE };
    if (isPending) return { status: 'loading' };
    return { status: 'success', stations: data ?? [] };
  }

  // 소비 컴포넌트의 effect 의존성으로 쓰이므로 참조를 고정한다.
  const setQuery = useCallback((next: string) => {
    setQueryState(next);
    // 입력을 바꾸면 이전 결과 창을 닫고 대기 상태로 되돌린다.
    setSubmittedQuery('');
    setIsEmptyQuery(false);
  }, []);

  const submitSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSubmittedQuery('');
      setIsEmptyQuery(true);
      return;
    }
    setIsEmptyQuery(false);
    setSubmittedQuery(trimmedQuery);
  }, [query]);

  const resetResults = useCallback(() => {
    setSubmittedQuery('');
    setIsEmptyQuery(false);
  }, []);

  return { query, searchState: resolveSearchState(), setQuery, submitSearch, resetResults };
}
