import type { ReactNode } from 'react'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'
import { Button } from './Button.tsx'
import { SkeletonRows } from './Skeleton.tsx'

export interface DataTableColumn {
  /** Grid span out of 12 — the design system's list layout is a 12-column grid. */
  span: number
  header: ReactNode
  align?: 'left' | 'right'
}

export interface DataTableProps {
  columns: DataTableColumn[]
  isEmpty?: boolean
  loading?: boolean
  emptyState?: ReactNode
  /** Hide on mobile, where rows stack instead. */
  hideHeaderOnMobile?: boolean
  /** Skeleton rows to show while `loading`. Defaults to 6. */
  loadingRows?: number
  className?: string
  children: ReactNode
}

/**
 * Container + grid header + row body. Column definitions stay in the project: this component only
 * owns the surface, the 12-column header, dividers and row rhythm.
 *
 * Row markup lives in `DataTableRow` so each page decides what its cells contain.
 */
export function DataTable({
  columns,
  isEmpty,
  loading,
  emptyState,
  hideHeaderOnMobile = true,
  loadingRows = 6,
  className,
  children,
}: DataTableProps) {
  const labels = useUiLabels()
  const template = columns.map((column) => `${column.span}fr`).join(' ')

  if (loading) {
    return (
      <DataTableShell className={className}>
        <SkeletonRows rows={loadingRows} />
        <span className="sr-only">{labels.loading}</span>
      </DataTableShell>
    )
  }
  if (isEmpty) {
    return (
      <DataTableShell className={className}>
        {emptyState ?? <p className="p-10 text-center text-[13px] text-muted-foreground">{labels.empty}</p>}
      </DataTableShell>
    )
  }
  return (
    <DataTableShell className={className}>
      <div
        className={cn(
          'border-b border-border bg-muted px-6 py-3 text-[11px] font-medium text-muted-foreground',
          hideHeaderOnMobile ? 'hidden md:grid' : 'grid',
        )}
        style={{ gridTemplateColumns: template }}
      >
        {columns.map((column, index) => (
          <div key={index} className={cn(column.align === 'right' && 'text-right')}>
            {column.header}
          </div>
        ))}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </DataTableShell>
  )
}

function DataTableShell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm dark:shadow-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DataTableRow({
  columns,
  className,
  children,
}: {
  columns: DataTableColumn[]
  className?: string
  children: ReactNode
}) {
  const template = columns.map((column) => `${column.span}fr`).join(' ')
  return (
    <div
      className={cn(
        'group gap-3 px-6 py-4 transition-colors hover:bg-muted md:grid md:items-center',
        className,
      )}
      style={{ gridTemplateColumns: template }}
    >
      {children}
    </div>
  )
}

/** Two-line primary cell: 13px medium title over 12px muted meta. */
export function DataTablePrimaryCell({
  title,
  meta,
  className,
}: {
  title: ReactNode
  meta?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <p className="truncate text-[13px] font-medium text-foreground">{title}</p>
      {meta ? <p className="mt-1 truncate text-[12px] text-muted-foreground">{meta}</p> : null}
    </div>
  )
}

/** Right-aligned row action strip; revealed on hover on pointer devices and on keyboard focus. */
export function DataTableActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1 transition-opacity focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
      {children}
    </div>
  )
}

export interface PaginationProps {
  page: number
  isLast: boolean
  onPrevious: () => void
  onNext: () => void
  /** Optional left-hand summary, e.g. "128 records". `total` is rendered raw when omitted. */
  summary?: ReactNode
  total?: number
  /** Total pages; when supplied a `Page 2 / 7` indicator appears between the arrows. */
  pageCount?: number
  className?: string
}

/** Footer pagination in the design system's compact language. */
export function Pagination({
  page,
  isLast,
  onPrevious,
  onNext,
  summary,
  total,
  pageCount,
  className,
}: PaginationProps) {
  const labels = useUiLabels()
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <p className="text-[12px] text-muted-foreground">
        {summary ?? (typeof total === 'number' ? total : null)}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onPrevious} disabled={page === 0}>
          {labels.previousPage}
        </Button>
        {typeof pageCount === 'number' ? (
          <span className="text-[12px] tabular-nums text-muted-foreground">
            {page + 1} / {pageCount}
          </span>
        ) : null}
        <Button variant="ghost" onClick={onNext} disabled={isLast}>
          {labels.nextPage}
        </Button>
      </div>
    </div>
  )
}
