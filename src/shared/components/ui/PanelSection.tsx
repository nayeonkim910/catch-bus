import type { ReactNode } from 'react';

type SectionHeadingProps = {
  children: ReactNode;
};

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex min-h-8 items-center justify-between">
      <h2 className="m-0 text-[17px] font-bold text-foreground">{children}</h2>
    </div>
  );
}

type SectionPlaceholderProps = {
  label: string;
  className?: string;
};

export function SectionPlaceholder({ label, className = '' }: SectionPlaceholderProps) {
  return (
    <div
      className={`grid min-h-37.5 place-items-center rounded-xl border border-dashed border-border bg-card/65 text-sm text-muted-foreground ${className}`}
    >
      {label}
    </div>
  );
}
