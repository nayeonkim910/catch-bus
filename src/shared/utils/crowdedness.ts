export type CrowdednessInfo = {
  label: string;
  dotColor: string;
};

// 경기 공공 API 혼잡도 코드: 1 여유 · 2 보통 · 3 혼잡 · 4 매우 혼잡 (0/미제공은 표시하지 않음).
const CROWDEDNESS: Record<number, CrowdednessInfo> = {
  1: { label: '여유', dotColor: '#22C55E' },
  2: { label: '보통', dotColor: '#F59E0B' },
  3: { label: '혼잡', dotColor: '#F97316' },
  4: { label: '매우 혼잡', dotColor: '#EF4444' },
};

export function getCrowdedness(code: number | null | undefined): CrowdednessInfo | null {
  return code == null ? null : (CROWDEDNESS[code] ?? null);
}
