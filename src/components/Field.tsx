import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '../cn.ts'

/**
 * Inputs are a "muted recess" at rest and become a "card float" with a hairline on focus. That
 * contrast is what separates form areas from command areas (whose buttons are pills).
 */
const fieldBase =
  'w-full rounded-xl border border-transparent bg-muted px-3 py-2.5 text-[13px] text-foreground ' +
  'placeholder:text-muted-foreground transition-colors ' +
  'focus:border-border focus:bg-card focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, 'appearance-none pr-8', className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

/** Large body editor (markdown, notes). Card surface, mono, with the stronger focus ring. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[120px] w-full resize-y rounded-xl border border-border bg-card px-3 py-3',
        'text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground',
        'focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export interface FieldProps {
  label: ReactNode
  /** Must match the id of the control passed as `children`. Generated when omitted. */
  htmlFor?: string
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
  children: ReactNode | ((id: string) => ReactNode)
}

/**
 * Label (11px medium muted) + control + hint/error slot. Supports either plain children or a
 * render function that receives a generated id, so the label and input always stay associated.
 */
export function Field({ label, htmlFor, hint, error, required, className, children }: FieldProps) {
  const generatedId = useId()
  const id = htmlFor ?? generatedId
  return (
    <div className={cn('block', className)}>
      <label htmlFor={id} className="mb-2 block text-[11px] font-medium text-muted-foreground">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </label>
      {typeof children === 'function' ? children(id) : children}
      {error ? (
        <p className="mt-1.5 text-[12px] text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function Checkbox({
  className,
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode }) {
  return (
    <label className="inline-flex items-center gap-2 text-[13px] text-foreground">
      <input
        type="checkbox"
        className={cn('h-3.5 w-3.5 rounded accent-primary', className)}
        {...props}
      />
      {label}
    </label>
  )
}
