import { create } from 'zustand';
import type { BusArrival, BusStation } from '@shared/types/bus';
import { createSelectedRoute, type SelectedRoute } from './selectedRoute';

type SelectionStore = {
  station: BusStation | null;
  selectedRoute: SelectedRoute | null;
  /** 정류장 선택 횟수. 같은 정류장을 다시 선택해도 값이 바뀌어 모바일 시트가 다시 열린다. */
  selectionSeq: number;
  selectStation: (station: BusStation) => void;
  /**
   * 노선을 선택한다. 재탭해도 유지된다(해제는 clearRoute = 오버레이 X 버튼만).
   * station을 함께 넘기면 그 정류장을 선택한다. 같은 정류장이어도 selectionSeq가 올라
   * 지도가 그 정류장으로 다시 이동한다(카드 탭 = 데려다줘).
   */
  selectRoute: (arrival: BusArrival, station?: BusStation) => void;
  clearRoute: () => void;
};

export const useSelectionStore = create<SelectionStore>()((set, get) => ({
  station: null,
  selectedRoute: null,
  selectionSeq: 0,

  selectStation: (station) => {
    // 선택 노선은 직전 정류장 맥락이었으므로 정류장이 바뀌면 지도 오버레이를 걷는다.
    set((state) => ({ station, selectedRoute: null, selectionSeq: state.selectionSeq + 1 }));
  },

  selectRoute: (arrival, station) => {
    if (get().selectedRoute?.routeId !== arrival.routeId) {
      set({ selectedRoute: createSelectedRoute(arrival) });
    }
    // selectStation은 노선을 함께 해제하므로 쓰지 않는다. 노선은 유지한 채 정류장만 갱신한다.
    if (station) {
      set((state) => ({ station, selectionSeq: state.selectionSeq + 1 }));
    }
  },

  clearRoute: () => set({ selectedRoute: null }),
}));
