import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string
  onChange: (value: string) => void
  /** Rendered on the right of the field, e.g. a keyboard chip or result count. */
  trailing?: ReactNode
  /** Show a clear button when the field has content. Defaults to true. */
  clearable?: boolean
}

/**
 * Search field in the standard input language (muted recess → card float on focus), with a leading
 * icon and an optional clear affordance. Pair with `useDebouncedValue` from `@arorms/core`.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, trailing, clearable = true, className, placeholder, ...props }, ref) => {
    const labels = useUiLabels()
    return (
      <div className={cn('relative', className)}>
        <Search
          size={14}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder ?? labels.search}
          aria-label={props['aria-label'] ?? placeholder ?? labels.search}
          className={cn(
            'w-full rounded-xl border border-transparent bg-muted py-2.5 pl-9 pr-9',
            'text-[13px] text-foreground placeholder:text-muted-foreground transition-colors',
            'focus:border-border focus:bg-card focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            '[&::-webkit-search-cancel-button]:hidden',
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>
        ) : clearable && value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={labels.clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>
    )
  },
)
SearchInput.displayName = 'SearchInput'
