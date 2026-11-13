import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../cn.ts'

/**
 * One layer up from the page canvas. Rules: 12px radius, hairline border, and the single light-mode
 * shadow. Never nest a Card inside a Card — use `rounded-xl bg-muted` for inset panels.
 */
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm dark:shadow-none', className)}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-[13px] font-semibold text-foreground', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-[12px] text-muted-foreground', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

/** Recessed surface for inset sections, table headers, stat tiles. Sits *below* a Card. */
export function InsetPanel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div className={cn('rounded-xl bg-muted', className)} {...props}>
      {children}
    </div>
  )
}
