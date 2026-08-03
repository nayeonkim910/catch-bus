// Tailwind 테마의 lg(--breakpoint-lg)를 읽어 데스크톱 판정 쿼리를 만든다.
// JS에 브레이크포인트 픽셀 값을 직접 적지 않기 위한 장치.
let cached: string | undefined;

export function desktopMediaQuery(): string {
  if (!cached) {
    const lg = getComputedStyle(document.documentElement)
      .getPropertyValue('--breakpoint-lg')
      .trim();
    // 스타일시트 적용 전에 호출되면 빈 값일 수 있어 안전값을 둔다.
    // 안전값은 추측이므로 캐시하지 않는다. 다음 호출에서 원본 읽기를 재시도한다.
    if (!lg) return '(min-width: 1024px)';
    cached = `(min-width: ${lg})`;
  }
  return cached;
}
