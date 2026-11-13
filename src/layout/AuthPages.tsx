import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@arorms/core'
import { Card } from '../components/Card.tsx'
import { Button } from '../components/Button.tsx'
import { LoadingText } from '../components/Feedback.tsx'
import { cn } from '../cn.ts'

export interface LoginPageProps {
  title: ReactNode
  description?: ReactNode
  signInLabel?: string
  /** Extra content below the sign-in button (legal copy, environment hint, SSO note). */
  footer?: ReactNode
  className?: string
}

/**
 * Sign-in screen for the OIDC redirect flow: a narrow card with a single primary action.
 * `handleCallback` failure is handled by `CallbackPage`.
 */
export function LoginPage({ title, description, signInLabel = 'Sign in', footer, className }: LoginPageProps) {
  const { login, ready } = useAuth()
  return (
    <div className={cn('flex min-h-screen items-center justify-center bg-background p-4', className)}>
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-[22px] font-semibold leading-tight text-foreground">{title}</h1>
        {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
        <Button
          variant="primary"
          className="mt-5 w-full"
          disabled={!ready}
          onClick={() => void login()}
        >
          {signInLabel}
        </Button>
        {footer ? <div className="mt-4 text-[12px] text-muted-foreground">{footer}</div> : null}
      </Card>
    </div>
  )
}

export interface CallbackPageProps {
  /** Where to land after a successful code exchange. */
  redirectTo?: string
  onSuccess?: () => void
  failedLabel?: string
  className?: string
}

/**
 * Landing route for the OIDC redirect. Exchanges the code once, then navigates. Failures are shown
 * inline in the danger tone rather than thrown into the console.
 */
export function CallbackPage({
  redirectTo = '/',
  onSuccess,
  failedLabel = 'Sign-in failed',
  className,
}: CallbackPageProps) {
  const { handleCallback } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    // React 18 StrictMode mounts effects twice; the code is single-use, so guard it.
    if (started.current) return
    started.current = true
    handleCallback()
      .then(() => {
        if (onSuccess) onSuccess()
        else window.location.assign(redirectTo)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error && err.message ? err.message : failedLabel)
      })
  }, [handleCallback, onSuccess, redirectTo, failedLabel])

  return (
    <div className={cn('flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-4', className)}>
      {error ? (
        <div className="max-w-sm text-center">
          <p className="text-[13px] font-medium text-danger">{failedLabel}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">{error}</p>
        </div>
      ) : (
        <LoadingText className="p-0" />
      )}
    </div>
  )
}
