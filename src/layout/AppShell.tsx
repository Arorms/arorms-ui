import { useState, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '../cn.ts'
import { Header } from './Header.tsx'
import { Sidebar, type Brand, type NavGroup } from './Sidebar.tsx'

export interface AppShellProps {
  nav: NavGroup[]
  brand: Brand
  /** Right side of the header. `LanguageSwitcher` is a sensible default here. */
  headerRight?: ReactNode
  /** Replaces the auto-derived breadcrumb in the header. */
  headerTitle?: ReactNode
  sidebarTop?: ReactNode
  sidebarBottom?: ReactNode
  userSlot?: ReactNode
  onLogout?: () => void
  /** Settings gear in the sidebar user card (appearance + language). Defaults to true. */
  showSettings?: boolean
  /** Max content width; the design system default is 1280px. */
  contentClassName?: string
  /** Render a sibling of `<Outlet />` instead (rarely needed). */
  children?: ReactNode
}

function matchNav(nav: NavGroup[], pathname: string): { group: string; label: string } | null {
  let best: { group: string; label: string; length: number } | null = null
  for (const group of nav) {
    for (const item of group.items) {
      const exact = item.end ?? item.to === '/'
      const hit = exact ? pathname === item.to : pathname.startsWith(item.to)
      // Longest prefix wins, so `/society/people` beats `/society`.
      if (hit && (!best || item.to.length > best.length)) {
        best = { group: group.title, label: item.label, length: item.to.length }
      }
    }
  }
  return best
}

/**
 * Application frame: sidebar + sticky header + content column. The content column owns the page
 * rhythm (`py-6 lg:py-8`, max 1280px, `space-y-5`) and the fade-in on route change.
 *
 * Everything project-specific — navigation, brand, user card, header widgets — arrives through
 * props. No business content lives here.
 */
export function AppShell({
  nav,
  brand,
  headerRight,
  headerTitle,
  sidebarTop,
  sidebarBottom,
  userSlot,
  onLogout,
  showSettings,
  contentClassName,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const current = matchNav(nav, pathname)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        nav={nav}
        brand={brand}
        topSlot={sidebarTop}
        bottomSlot={sidebarBottom}
        userSlot={userSlot}
        onLogout={onLogout}
        showSettings={showSettings}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenu={() => setMobileOpen(true)}
          title={
            headerTitle ??
            (current ? (
              <span className="flex items-center gap-2">
                <span className="hidden text-muted-foreground sm:inline">{current.group}</span>
                <span className="hidden text-border sm:inline">/</span>
                <span className="font-medium text-foreground">{current.label}</span>
              </span>
            ) : null)
          }
          right={headerRight}
        />
        <main
          className={cn(
            'mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 lg:px-8 lg:py-8',
            contentClassName,
          )}
        >
          <div key={pathname} className="animate-fade-in space-y-5">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}
