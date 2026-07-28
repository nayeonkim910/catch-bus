import { useEffect, useRef, useState } from 'react';
import type { BusStation } from '@shared/types/bus';
import type { Coordinates } from './useCurrentLocation';
import { loadKakaoMapsSdk } from './kakaoMapsSdk';

const INITIAL_MAP_LEVEL = 4;
const INITIAL_MAP_CENTER: Coordinates = {
  latitude: 37.2636,
  longitude: 127.0286,
};
// 중심점 주변 조회 결과가 넓은 지도 전체를 대표하지 못하는 축척에서는 마커 조회를 중단한다.
const MAX_STATION_MARKER_LEVEL = 5;
const MAP_IDLE_DELAY_MS = 500;

type UseKakaoMapParams = {
  station: BusStation | null;
};

export function useKakaoMap({ station }: UseKakaoMapParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [mapLevel, setMapLevel] = useState(INITIAL_MAP_LEVEL);
  const [searchCenter, setSearchCenter] = useState<Coordinates | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function initializeMap() {
      try {
        const maps = await loadKakaoMapsSdk();
        if (isCancelled || !containerRef.current) return;

        // 정류장을 선택하기 전 지도를 표시할 초기 중심 좌표다.
        // 이 좌표는 선택 정류장 상태로 사용하지 않는다.
        const center = new maps.LatLng(INITIAL_MAP_CENTER.latitude, INITIAL_MAP_CENTER.longitude);
        const nextMap = new maps.Map(containerRef.current, {
          center,
          level: INITIAL_MAP_LEVEL,
        });

        setMap(nextMap);
        setSearchCenter(INITIAL_MAP_CENTER);
      } catch (error) {
        if (isCancelled) return;

        console.error('카카오맵 초기화 실패:', error);
        setErrorMessage('지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      }
    }

    void initializeMap();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!map || !station) return;
    map.setCenter(new kakao.maps.LatLng(station.latitude, station.longitude));
  }, [map, station]);

  useEffect(() => {
    if (!map) return;

    const activeMap = map;
    let timeoutId: number | null = null;

    function updateVisibleArea() {
      if (timeoutId !== null) window.clearTimeout(timeoutId);

      // 지도 이동 중 연속 요청을 막고, 이동이 끝난 뒤의 중심만 조회한다.
      timeoutId = window.setTimeout(() => {
        const center = activeMap.getCenter();
        const level = activeMap.getLevel();

        setMapLevel(level);
        if (level <= MAX_STATION_MARKER_LEVEL) {
          setSearchCenter({ latitude: center.getLat(), longitude: center.getLng() });
        }
      }, MAP_IDLE_DELAY_MS);
    }

    kakao.maps.event.addListener(activeMap, 'idle', updateVisibleArea);
    return () => {
      kakao.maps.event.removeListener(activeMap, 'idle', updateVisibleArea);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [map]);

  useEffect(() => {
    const container = containerRef.current;
    if (!map || !container) return;

    // 지도는 항상 보이지만, 뷰포트·회전 등으로 컨테이너 크기가 바뀌면 다시 그린다.
    const resizeObserver = new ResizeObserver(() => map.relayout());
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [map]);

  return {
    containerRef,
    map,
    errorMessage,
    searchCenter,
    canShowStations: mapLevel <= MAX_STATION_MARKER_LEVEL,
  };
}
