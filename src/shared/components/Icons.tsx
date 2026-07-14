const iconClass =
  'size-5 shrink-0 fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]';

export function SearchIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function MapPinIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

export function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      className={`${iconClass} ${filled ? 'fill-current' : ''}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}
