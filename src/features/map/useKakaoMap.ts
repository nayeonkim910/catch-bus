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
  /** 정류장 선택 사건 카운터. 같은 정류장 재선택에도 화면 밖이면 다시 데려가기 위해 받는다. */
  selectionSeq: number;
};

export function useKakaoMap({ station, selectionSeq }: UseKakaoMapParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [mapLevel, setMapLevel] = useState(INITIAL_MAP_LEVEL);
  // 초기 중심 상수로 seed한다. 근처정류장 조회가 지도 SDK 로딩을 기다리지 않고 마운트 즉시 진행되도록.
  // 지도 생성 후 center도 같은 상수라 queryKey가 같아 중복 요청은 없다.
  const [searchCenter, setSearchCenter] = useState<Coordinates | null>(INITIAL_MAP_CENTER);
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
    const position = new kakao.maps.LatLng(station.latitude, station.longitude);
    // 이미 화면 안이면(지도 마커를 클릭한 흔한 경우) 지도를 움직이지 않는다. 움직이면 idle →
    // 근처정류장 재조회 → 마커가 다시 그려지는 깜빡임이 생긴다. 검색 등 화면 밖 정류장만 데려온다.
    if (map.getBounds().contain(position)) return;
    map.setCenter(position);
  }, [map, station, selectionSeq]);

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
