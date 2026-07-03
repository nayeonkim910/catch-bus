import type { ReactNode } from 'react'

type SectionHeadingProps = {
  children: ReactNode
  action?: string
}

export function SectionHeading({ children, action }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex min-h-8 items-center justify-between">
      <h2 className="m-0 text-[17px] font-bold text-slate-900">{children}</h2>
      {action && <button className="cursor-pointer bg-transparent px-2 py-1.5 text-brand">{action}</button>}
    </div>
  )
}

type SectionPlaceholderProps = {
  label: string
  className?: string
}

export function SectionPlaceholder({ label, className = '' }: SectionPlaceholderProps) {
  return (
    <div className={`grid min-h-37.5 place-items-center rounded-xl border border-dashed border-slate-300 bg-white/65 text-sm text-slate-400 ${className}`}>
      {label}
    </div>
  )
}
