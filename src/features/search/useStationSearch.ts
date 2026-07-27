import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchStationsQueryOptions } from '../../lib/busQueries';

export function useStationSearch() {
  const [query, setQueryText] = useState('');
  // 입력값과 분리된 '제출된 검색어'. 이 값이 바뀔 때만 조회가 나간다.
  const [submittedQuery, setSubmittedQuery] = useState('');

  const { data, isPending, isError } = useQuery({
    ...searchStationsQueryOptions(submittedQuery),
    enabled: submittedQuery.length > 0,
  });

  // 소비 컴포넌트의 effect 의존성으로 쓰이므로 참조를 고정한다.
  const setQuery = useCallback((next: string) => {
    setQueryText(next);
    setSubmittedQuery(''); // 입력을 바꾸면 이전 결과 창을 닫는다.
  }, []);

  const submitSearch = useCallback(() => {
    setSubmittedQuery(query.trim()); // 빈 값이면 enabled:false라 조회가 나가지 않는다.
  }, [query]);

  const reset = useCallback(() => setSubmittedQuery(''), []);

  // 결과 창의 표시 여부는 '제출된 검색어가 있는가'로 결정한다(fetch 상태와 분리).
  const isOpen = submittedQuery.length > 0;

  return {
    query,
    setQuery,
    submitSearch,
    reset,
    isOpen,
    isLoading: isOpen && isPending,
    isError,
    stations: data ?? [],
  };
}
