import type { ReactNode } from 'react'
import { cn } from '../cn.ts'

export interface SegmentedOption<T extends string> {
  value: T
  label?: ReactNode
  /** Icon-only segments keep their accessible name from `label` (string) or `title`. */
  icon?: ReactNode
  title?: string
}

/**
 * Segmented pill control — the shape used by `ThemeSwitcher` and the article language tabs.
 * Renders as a radiogroup so keyboard users can traverse it with arrows.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
  ariaLabel,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  className?: string
  ariaLabel?: string
}) {
  const padding = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-[12px]'
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center rounded-full border border-border bg-muted p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
              padding,
              active
                ? 'border border-border bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.icon}
            {option.label ? (
              typeof option.label === 'string' ? <span>{option.label}</span> : option.label
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
