import type { ReactNode } from 'react';
import { Button } from '../../shared/components/ui/Button';
import type { DetailsPanelSize } from './detailsPanelTypes';

type PanelSizeControlsProps = {
  panelSize: DetailsPanelSize;
  onChange: (size: DetailsPanelSize) => void;
};

export function PanelSizeControls({ panelSize, onChange }: PanelSizeControlsProps) {
  return (
    <div
      className="hidden shrink-0 items-center gap-1 lg:flex"
      role="group"
      aria-label="하단 패널 조작"
    >
      {panelSize === 'expanded' ? (
        <PanelControlButton label="기본 보기" onClick={() => onChange('default')}>
          <path d="M6 12h12" />
        </PanelControlButton>
      ) : (
        <PanelControlButton label="크게 보기" onClick={() => onChange('expanded')}>
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M16 3h3a2 2 0 0 1 2 2v3" />
          <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </PanelControlButton>
      )}
    </div>
  );
}

function PanelControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button variant="secondary" size="sm" aria-label={label} title={label} onClick={onClick}>
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <span>{label}</span>
    </Button>
  );
}
