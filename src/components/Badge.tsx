import type { ReactNode } from 'react'
import { cn } from '../cn.ts'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'primary'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  primary: 'border border-primary/25 bg-primary/10 text-primary',
  success: 'border border-success/25 bg-success/10 text-success',
  warning: 'border border-warning/25 bg-warning/10 text-warning',
  danger: 'border border-danger/25 bg-danger/10 text-danger',
}

/**
 * Status only: neutral / primary / success / warning / danger. Never colour ordinary data such as
 * categories or tags — use a neutral badge for those.
 */
export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
