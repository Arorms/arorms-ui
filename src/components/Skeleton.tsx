import { cn } from '../cn.ts'

/** Grey block used while a list or card is loading. Sizes come from `className`. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-lg bg-muted', className)} />
}

/**
 * Placeholder rows for a list/table. Mirrors the real row rhythm (avatar circle + two text lines)
 * so the layout does not jump when data lands.
 */
export function SkeletonRows({
  rows = 6,
  avatar = false,
  className,
}: {
  rows?: number
  avatar?: boolean
  className?: string
}) {
  return (
    <div className={cn('divide-y divide-border', className)} aria-busy="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-3 px-6 py-4">
          {avatar ? <Skeleton className="h-9 w-9 shrink-0 rounded-full" /> : null}
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Grey block for stat tiles while numbers are in flight. */
export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-5 shadow-sm dark:shadow-none', className)}>
      <Skeleton className="mb-3 h-9 w-9 rounded-xl" />
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="h-7 w-16" />
    </div>
  )
}

/** A single grey paragraph; `lines` controls how many bars. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} aria-busy="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn('h-3', index === lines - 1 ? 'w-2/5' : 'w-full')} />
      ))}
    </div>
  )
}

/** Avatar circle from display initials, sized `sm | md | lg`. */
export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = { sm: 'h-7 w-7 text-[11px]', md: 'h-8 w-8 text-[12px]', lg: 'h-10 w-10 text-[13px]' }
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-foreground font-medium text-background',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}
