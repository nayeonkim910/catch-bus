type BusIconProps = {
  className?: string
}

export function BusIcon({ className = 'size-5' }: BusIconProps) {
  return (
    <svg
      className={`fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] ${className}`}
      viewBox="0 0 24 20"
      aria-hidden="true"
    >
      <path d="M4 13V6c0-2 2.6-3 8-3s8 1 8 3v7" />
      <path d="M4 9h16M6 13h12M7 16v1.5M17 16v1.5" />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}
