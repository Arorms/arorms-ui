import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'

export type ToastTone = 'success' | 'danger' | 'info'

export interface ToastInput {
  message: string
  tone?: ToastTone
  /** Milliseconds before auto-dismiss. Defaults to 4200. */
  duration?: number
}

interface ToastItem extends ToastInput {
  id: number
}

export interface ToastValue {
  pushToast: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastValue | undefined>(undefined)

const toneIcon = {
  success: CheckCircle2,
  danger: TriangleAlert,
  info: Info,
} as const

export function ToastProvider({ children }: { children: ReactNode }) {
  const labels = useUiLabels()
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    ({ message, tone = 'info', duration = 4200 }: ToastInput) => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, tone, duration }])
      window.setTimeout(() => removeToast(id), duration)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed right-4 top-4 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => {
          const Icon = toneIcon[toast.tone ?? 'info']
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'animate-fade-in flex items-start gap-3 rounded-xl border bg-card px-4 py-3 text-[13px] shadow-sm',
                toast.tone === 'success' && 'border-success/25',
                toast.tone === 'danger' && 'border-danger/25',
                (toast.tone === 'info' || !toast.tone) && 'border-border',
              )}
            >
              <Icon
                size={16}
                className={cn(
                  'mt-0.5 shrink-0',
                  toast.tone === 'success' && 'text-success',
                  toast.tone === 'danger' && 'text-danger',
                  (toast.tone === 'info' || !toast.tone) && 'text-primary',
                )}
              />
              <p className="min-w-0 flex-1 text-foreground">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label={labels.close}
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used inside <ToastProvider>')
  return value
}
