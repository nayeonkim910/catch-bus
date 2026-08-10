const BUS_STOP_ICON = `
  <svg viewBox="0 0 32 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="26" height="12" rx="3" />
    <path d="M6 8h5v5H6zM13 8h5v5h-5zM20 8h5v5h-5z" />
    <path d="M3 14h26M26 8v9M29 10h1.5v4H29" />
    <circle cx="9" cy="18" r="2" />
    <circle cx="24" cy="18" r="2" />
  </svg>
`;

export function createBusStopMarker(stationName: string, isSelected: boolean) {
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.title = stationName;
  marker.setAttribute('aria-label', `${stationName} 정류장 선택`);
  // 카카오 지도 타일은 다크 모드가 없어 항상 밝다. 그래서 지도 위 마커는 앱 테마(semantic 토큰)를
  // 따라가지 않고, 프로젝트 primitive를 직접 참조해 항상 라이트 배색으로 고정한다.
  marker.className = isSelected
    ? 'relative grid size-11 cursor-pointer place-items-center rounded-full border-[3px] border-white bg-[var(--blue-600)] text-white shadow-[0_5px_14px_rgb(15_23_42/35%)] after:absolute after:-bottom-1.5 after:size-3 after:rotate-45 after:rounded-sm after:border-b-[3px] after:border-r-[3px] after:border-white after:bg-[var(--blue-600)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-600)]'
    : 'relative grid size-9 cursor-pointer place-items-center rounded-full border-2 border-[var(--blue-200)] bg-white text-[var(--blue-600)] shadow-[0_3px_10px_rgb(15_23_42/25%)] after:absolute after:-bottom-1 after:size-2.5 after:rotate-45 after:rounded-[2px] after:border-b-2 after:border-r-2 after:border-[var(--blue-200)] after:bg-white hover:border-[var(--blue-300)] hover:bg-[var(--blue-50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-600)]';
  // 고정된 SVG만 삽입하며 stationName 등 외부 데이터는 마크업에 포함하지 않는다.
  marker.innerHTML = BUS_STOP_ICON;

  const icon = marker.querySelector('svg');
  icon?.setAttribute('class', `relative z-10 ${isSelected ? 'h-7 w-8' : 'h-6 w-7'}`);

  return marker;
}
