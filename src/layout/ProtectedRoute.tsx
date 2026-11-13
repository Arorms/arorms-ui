import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@arorms/core'
import { FullPageSpinner } from '../components/Feedback.tsx'

/**
 * Gate for signed-in routes. Waits for auth resolution (spinner), then either renders or redirects
 * to the login route. Lives in `ui` rather than `core` because it paints a spinner.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth()
  if (!ready) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
