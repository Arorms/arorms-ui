import type { ReactNode } from 'react'
import { cn } from '../cn.ts'

export interface ChipProps {
  /** Selected chips fill with `bg-primary`; unselected stay on the card surface. */
  selected?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
  disabled?: boolean
}

/**
 * Pill tag/chip — the one shape allowed to be fully rounded in a form context.
 * Selected state is the design system's chip recipe: `bg-primary text-primary-foreground`.
 */
export function Chip({ selected = false, onClick, children, className, disabled }: ChipProps) {
  const interactive = typeof onClick === 'function'
  const classes = cn(
    'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
    selected
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
    interactive && 'cursor-pointer',
    disabled && 'cursor-not-allowed opacity-50',
    className,
  )

  if (!interactive) return <span className={classes}>{children}</span>

  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={selected} className={classes}>
      {children}
    </button>
  )
}

/** Static, non-interactive tag chip for row metadata. Never coloured by data value. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

export interface ChipGroupOption {
  value: string
  label: ReactNode
}

/**
 * Single-select filter row ("All / Income / Expense"). Renders chips and reports the chosen value;
 * `value` of the first option is the natural "all" entry.
 */
export function ChipGroup({
  options,
  value,
  onChange,
  className,
}: {
  options: ChipGroupOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div role="group" className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <Chip key={option.value} selected={option.value === value} onClick={() => onChange(option.value)}>
          {option.label}
        </Chip>
      ))}
    </div>
  )
}

/** Multi-select chip set, e.g. tag pickers. Toggling reports the next selection array. */
export function ChipToggleGroup({
  options,
  selected,
  onToggle,
  className,
}: {
  options: ChipGroupOption[]
  selected: string[]
  onToggle: (value: string) => void
  className?: string
}) {
  return (
    <div role="group" className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <Chip
          key={option.value}
          selected={selected.includes(option.value)}
          onClick={() => onToggle(option.value)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  )
}
