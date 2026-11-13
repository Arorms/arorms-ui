import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'
import { Button } from './Button.tsx'

export interface ModalProps {
  title: ReactNode
  onClose: () => void
  children?: ReactNode
  /** Action row pinned under the body; typically two equal-width buttons. */
  footer?: ReactNode
  /** `md` for edit dialogs, `sm` for confirmations, `lg` for wide editors. */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Hide the top-right close button when the flow requires an explicit choice. */
  hideClose?: boolean
  className?: string
  /** Form element id: renders the body as a `<form>` so Enter submits. */
  asForm?: boolean
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
} as const

/**
 * Overlay dialog. Escape, overlay click and the close button all dismiss; body scroll is locked and
 * focus moves to the panel on open.
 */
export function Modal({
  title,
  onClose,
  children,
  footer,
  size = 'md',
  hideClose,
  className,
  asForm,
  onSubmit,
}: ModalProps) {
  const labels = useUiLabels()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape closes. Captured so nested popovers cannot swallow it.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Lock background scrolling while the dialog is mounted.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Move focus into the panel without stealing it from an autofocused control.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (panel.contains(document.activeElement)) return
    panel.focus()
  }, [])

  const body = (
    <>
      {children}
      {footer ? <div className="flex gap-3 pt-2">{footer}</div> : null}
    </>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'max-h-[90vh] w-full overflow-auto rounded-2xl border border-border bg-card p-6 shadow-xl',
          'focus:outline-none',
          sizes[size],
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-[15px] font-semibold text-foreground">
            {title}
          </h2>
          {hideClose ? null : (
            <button
              type="button"
              onClick={onClose}
              aria-label={labels.close}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {asForm ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            {body}
          </form>
        ) : (
          <div className="space-y-4">{body}</div>
        )}
      </div>
    </div>
  )
}

export interface ConfirmDialogProps {
  title: ReactNode
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** `danger` for destructive actions; `primary` for neutral confirmations. */
  tone?: 'danger' | 'primary'
  isPending?: boolean
  pendingLabel?: string
  onConfirm: () => void
  onClose: () => void
}

/** Two-button confirmation built on `Modal`: equal-width cancel and confirm, destructive by default. */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = 'danger',
  isPending,
  pendingLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const labels = useUiLabels()
  return (
    <Modal title={title} onClose={onClose} size="sm" hideClose>
      {description ? <p className="text-[13px] text-muted-foreground">{description}</p> : null}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onClose}
          disabled={isPending}
          className="flex-1 rounded-full bg-muted text-foreground hover:bg-muted/70"
        >
          {cancelLabel ?? labels.cancel}
        </Button>
        <Button
          variant={tone}
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? (pendingLabel ?? labels.loading) : (confirmLabel ?? labels.confirm)}
        </Button>
      </div>
    </Modal>
  )
}
