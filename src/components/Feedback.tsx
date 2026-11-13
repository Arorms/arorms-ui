import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'

/** Circular indeterminate indicator. `size` is the pixel diameter (default 32 = `w-8 h-8`). */
export function Spinner({
  size = 32,
  className,
  label,
}: {
  size?: number
  className?: string
  label?: string
}) {
  const labels = useUiLabels()
  const accessibleLabel = label ?? labels.loading
  return (
    <div
      role="status"
      aria-label={accessibleLabel}
      className={cn('animate-spin rounded-full border-2 border-border border-t-primary', className)}
      style={{ width: size, height: size }}
    />
  )
}

/** Centered spinner filling the viewport — used while auth resolution is pending. */
export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner />
    </div>
  )
}

/** Inline text loading state for list bodies. */
export function LoadingText({ children, className }: { children?: ReactNode; className?: string }) {
  const labels = useUiLabels()
  return (
    <div className={cn('p-10 text-center text-[13px] text-muted-foreground', className)}>
      {children ?? labels.loading}
    </div>
  )
}

export function Empty({
  message,
  icon: Icon,
  action,
  className,
}: {
  message?: string
  icon?: LucideIcon
  action?: ReactNode
  className?: string
}) {
  const labels = useUiLabels()
  return (
    <div className={cn('rounded-lg border border-border bg-card p-10 text-center', className)}>
      {Icon ? <Icon size={32} className="mx-auto mb-3 text-muted-foreground/40" /> : null}
      <p className="mb-3 text-[13px] text-muted-foreground">{message ?? labels.empty}</p>
      {action}
    </div>
  )
}

export function ErrorText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-[12px] text-danger', className)}>{children}</p>
}
