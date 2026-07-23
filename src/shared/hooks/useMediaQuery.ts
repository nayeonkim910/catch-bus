import { useCallback, useSyncExternalStore } from "react";

/**
 * 미디어쿼리 매칭 여부를 구독한다.
 *
 * matchMedia는 "현재 값을 읽을 수 있고 변경을 구독할 수 있는" 외부 스토어라,
 * 그 용도로 설계된 useSyncExternalStore로 구독한다.
 *
 * useState + useEffect로도 동등하게 구현되지만, 초기값 lazy init과 구독 직후
 * 값 재확인을 직접 챙겨야 하고 빠뜨려도 조용히 넘어간다. 이 훅에는 그 여지가 없다.
 * 반환값이 boolean이라 Object.is 비교로 안정적이다.
 * (CSR 전용 앱이라 서버 스냅샷 인자는 두지 않는다.)
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
  );
}
