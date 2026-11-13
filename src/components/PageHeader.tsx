import type { ReactNode } from 'react'
import { cn } from '../cn.ts'

/** Page title block: 22px semibold title, 13px muted description, right-aligned actions. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-4 sm:flex-row sm:items-end',
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold leading-tight text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/** Compact stat tile: 36px icon square, 11px label, 28px value, 12px subtext. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  badge,
  className,
}: {
  label: ReactNode
  value: ReactNode
  hint?: ReactNode
  icon?: React.ComponentType<{ size?: number }>
  badge?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-5 shadow-sm dark:shadow-none', className)}>
      {(Icon || badge) && (
        <div className="mb-3 flex items-start justify-between">
          {Icon ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted text-foreground">
              <Icon size={16} />
            </div>
          ) : (
            <span />
          )}
          {badge}
        </div>
      )}
      <div className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="text-[28px] font-semibold leading-none text-foreground">{value}</div>
      {hint ? <div className="mt-2 text-[12px] text-muted-foreground">{hint}</div> : null}
    </div>
  )
}
