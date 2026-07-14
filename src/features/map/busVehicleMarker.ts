// 도로 위 실제 차량을 나타내는 버스 글리프. 정류장 마커(핀 형태)와 시각적으로 구분된다.
const BUS_GLYPH = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="5" y="3" width="14" height="15" rx="3" />
    <path d="M5 9h14" />
    <path d="M8 18v2M16 18v2" />
    <circle cx="9" cy="13.5" r="1" />
    <circle cx="15" cy="13.5" r="1" />
  </svg>
`;

type BusVehicleMarkerParams = {
  /** 스크린리더용 설명 (노선·위치·혼잡도 등). */
  label: string;
  accentColor: string;
  dotColor: string | null;
};

/**
 * 버스 차량 마커 DOM을 만든다.
 * 동적 값(라벨·색)은 속성/스타일로만 주입하고, innerHTML에는 고정 SVG만 넣어 XSS를 방지한다.
 */
export function createBusVehicleMarker({ label, accentColor, dotColor }: BusVehicleMarkerParams) {
  const marker = document.createElement('div');
  marker.setAttribute('role', 'img');
  marker.setAttribute('aria-label', label);
  marker.title = label;
  marker.className =
    'relative grid size-8 place-items-center rounded-full border-2 border-white text-white shadow-[0_3px_10px_rgb(15_23_42/40%)]';
  marker.style.backgroundColor = accentColor;
  marker.innerHTML = BUS_GLYPH;

  const icon = marker.querySelector('svg');
  icon?.setAttribute('class', 'size-5');

  if (dotColor) {
    const dot = document.createElement('span');
    dot.className = 'absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white';
    dot.style.backgroundColor = dotColor;
    marker.append(dot);
  }

  return marker;
}
