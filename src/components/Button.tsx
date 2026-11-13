import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../cn.ts'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

/**
 * Intent only: `primary | secondary | ghost | danger`. There is deliberately no size × tone matrix
 * — sizing and one-off adjustment belong in `className`.
 *
 * Geometry follows the design system: command buttons are pills, secondary buttons are 12px.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    'px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
  secondary:
    'px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted',
  ghost: 'p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground',
  danger: 'px-4 py-2.5 rounded-full bg-danger text-primary-foreground hover:bg-danger/90',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  /**
   * Shows a spinner and disables the button. `loadingText` replaces the children so the width does
   * not jump between "Save" and "Save…".
   */
  loading?: boolean
  loadingText?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', type = 'button', className, loading, loadingText, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 text-[13px] font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : null}
      {loading && loadingText ? loadingText : children}
    </button>
  ),
)
Button.displayName = 'Button'

/**
 * Destructive *icon* affordance used in row actions. Separate from `Button` because its hover
 * language is a tint, not a fill.
 */
export function IconButton({
  tone = 'neutral',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'neutral' | 'danger' }) {
  return (
    <button
      type={type}
      className={cn(
        'p-2 rounded-lg text-muted-foreground transition-colors',
        tone === 'neutral' && 'hover:bg-muted hover:text-foreground',
        tone === 'danger' && 'hover:bg-danger/10 hover:text-danger',
        className,
      )}
      {...props}
    />
  )
}
