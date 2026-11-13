import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { ArrowLeft, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'
import { Button } from './Button.tsx'
import { Card } from './Card.tsx'

/** Inset section used inside a Card: muted tile + 13px semibold heading + optional actions. */
export function SectionHeader({
  title,
  description,
  actions,
  icon: Icon,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="flex min-w-0 items-start gap-2.5">
        {Icon ? (
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon size={14} />
          </div>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-foreground">{title}</h2>
          {description ? <p className="mt-1 text-[12px] text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/**
 * Detail page shell: back link + title, a right-aligned action cluster, and the body.
 * Matches the header used by `PageHeader`, plus the quiet back-link row detail pages need.
 */
export function DetailHeader({
  title,
  backTo,
  backLabel,
  description,
  actions,
  className,
}: {
  title: ReactNode
  /** Rendered as a router `Link`; omit to hide the back row. */
  backTo?: string
  backLabel?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  const labels = useUiLabels()
  return (
    <div className={cn('flex flex-col justify-between gap-4 sm:flex-row sm:items-end', className)}>
      <div className="min-w-0">
        {backTo ? (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
            {backLabel ?? labels.back}
          </Link>
        ) : null}
        <h1 className="mt-2 text-[22px] font-semibold leading-tight text-foreground">{title}</h1>
        {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/**
 * Label/value pair for read-only detail views. Label is the 11px muted micro-label, value is 13px
 * foreground. Long values wrap; empty values render a muted placeholder.
 */
export function DescriptionItem({
  label,
  children,
  className,
}: {
  label: ReactNode
  children?: ReactNode
  className?: string
}) {
  const labels = useUiLabels()
  const isEmpty = children === null || children === undefined || children === '' || children === false
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="mb-1 text-[11px] font-medium text-muted-foreground">{label}</dt>
      <dd className="text-[13px] text-foreground break-words">
        {isEmpty ? <span className="text-muted-foreground">{labels.notProvided}</span> : children}
      </dd>
    </div>
  )
}

/** Two-column responsive grid of `DescriptionItem`s. Use inside a Card. */
export function DescriptionList({
  children,
  columns = 2,
  className,
}: {
  children: ReactNode
  columns?: 1 | 2 | 3
  className?: string
}) {
  const grid = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  }[columns]
  return <dl className={cn('grid gap-4', grid, className)}>{children}</dl>
}

/**
 * Card with a header block and optional footer — the standard "section of a page" container.
 * Never nest these inside one another; use `InsetPanel` for inner groupings.
 */
export function SectionCard({
  title,
  description,
  actions,
  icon,
  footer,
  className,
  bodyClassName,
  children,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  icon?: LucideIcon
  footer?: ReactNode
  className?: string
  bodyClassName?: string
  children?: ReactNode
}) {
  return (
    <Card className={className}>
      <div className="border-b border-border px-6 py-4">
        <SectionHeader title={title} description={description} actions={actions} icon={icon} />
      </div>
      <div className={cn('p-6', bodyClassName)}>{children}</div>
      {footer ? <div className="border-t border-border px-6 py-3">{footer}</div> : null}
    </Card>
  )
}

export interface ItemCardProps {
  title: ReactNode
  meta?: ReactNode
  icon?: LucideIcon
  /** Row actions, hidden until hover/focus on pointer devices. */
  actions?: ReactNode
  onClick?: () => void
  className?: string
}

/** Compact entity card (32px icon tile + title/meta + hover-revealed actions). */
export function ItemCard({ title, meta, icon: Icon, actions, onClick, className }: ItemCardProps) {
  const content = (
    <>
      {Icon ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon size={14} />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-foreground">{title}</div>
        {meta ? <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1 transition-opacity focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          {actions}
        </div>
      ) : null}
    </>
  )

  const classes = cn(
    'group flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left',
    'shadow-sm transition-colors dark:shadow-none',
    onClick && 'hover:bg-muted',
    className,
  )

  if (!onClick) return <div className={classes}>{content}</div>
  return (
    <button type="button" onClick={onClick} className={cn(classes, 'w-full')}>
      {content}
    </button>
  )
}

/**
 * Filter/summary bar placed above a table or grid. The bar is a card; its controls use `bg-muted`
 * inputs so it reads as a command strip rather than a form section.
 */
export function FilterBar({
  children,
  actions,
  className,
}: {
  children: ReactNode
  /** Right-aligned cluster: counts, clear-filters button, view toggles. */
  actions?: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">{children}</div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </Card>
  )
}

/** Error panel with a retry affordance, for list bodies that failed to load. */
export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: ReactNode
  onRetry?: () => void
  className?: string
}) {
  const labels = useUiLabels()
  return (
    <Card className={cn('p-10 text-center', className)}>
      <p className="text-[13px] text-danger">{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} className="mt-4">
          {labels.retry}
        </Button>
      ) : null}
    </Card>
  )
}

/**
 * Full empty state for a standalone region: icon tile, headline, supporting line and a primary
 * action. Richer than `Empty`, for pages whose only content is missing.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-border bg-card p-10 text-center',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        <Icon size={22} strokeWidth={1.6} />
      </div>
      <p className="mt-4 text-[13px] font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-[280px] text-[12px] text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
