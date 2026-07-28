type EmptyStateProps = {
  title: string;
  description: string;
};

/**
 * 패널 전체를 채우는 빈 상태 카드. 상세 패널의 "정류장 선택", 즐겨찾기의 "비어있음"처럼
 * 콘텐츠가 없을 때 중앙에 점선 카드로 안내한다. 부모가 flex column(flex-1)이어야 세로 중앙 정렬된다.
 */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="grid min-h-0 flex-1 place-items-center p-6 text-center">
      <div className="max-w-sm rounded-2xl border border-dashed border-border bg-card/[0.55] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
