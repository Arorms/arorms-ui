import { Link, NavLink } from 'react-router-dom'
import { Search, X, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'
import { IconButton } from '../components/Button.tsx'
import { SettingsMenu } from '../components/SettingsMenu.tsx'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Only match the exact path. Defaults to true for `/`, false otherwise. */
  end?: boolean
  /** Unread/pending counter rendered as a small pill; hidden when zero or undefined. */
  count?: number
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface Brand {
  title: string
  subtitle?: string
  /** One-character logo tile. Defaults to the first character of `title`. */
  initial?: string
  /** Router target when the brand block is clicked. Defaults to `/`. */
  to?: string
}

export interface SidebarProps {
  nav: NavGroup[]
  brand: Brand
  /** Extra content between the brand block and the navigation (e.g. a search field). */
  topSlot?: ReactNode
  /** Extra content above the user card (links, footer actions). */
  bottomSlot?: ReactNode
  /** Rendered at the bottom in the user card; defaults to nothing. */
  userSlot?: ReactNode
  /** Optional sign-out handler; the button is hidden when omitted. */
  onLogout?: () => void
  /** Show the settings gear (appearance + language) in the user card. Defaults to true. */
  showSettings?: boolean
  /** Mobile drawer state, controlled by `AppShell`. */
  open: boolean
  onClose: () => void
  className?: string
}

/**
 * 272px sidebar. Desktop: sticky column. Mobile: fixed drawer with a blurred scrim.
 * Active navigation is the only place `bg-primary` fills a block.
 */
export function Sidebar({
  nav,
  brand,
  topSlot,
  bottomSlot,
  userSlot,
  onLogout,
  showSettings = true,
  open,
  onClose,
  className,
}: SidebarProps) {
  const labels = useUiLabels()
  const initial = brand.initial ?? brand.title.slice(0, 1).toUpperCase()
  const brandHref = brand.to ?? '/'

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label={labels.closeMenu}
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      ) : null}
      <aside
        className={cn(
          'fixed top-0 z-40 flex h-screen w-[272px] shrink-0 flex-col border-r border-border bg-card',
          'transition-transform duration-200 lg:sticky lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          className,
        )}
      >
        <div className="flex h-[64px] shrink-0 items-center justify-between px-6">
          <Link to={brandHref} className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground">
              <span className="text-[11px] font-bold text-background">{initial}</span>
            </div>
            <div className="min-w-0 leading-none">
              <div className="truncate text-[13px] font-semibold text-foreground">{brand.title}</div>
              {brand.subtitle ? (
                <div className="-mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
                  {brand.subtitle}
                </div>
              ) : null}
            </div>
          </Link>
          <IconButton className="lg:hidden" onClick={onClose} aria-label={labels.closeMenu}>
            <X size={16} />
          </IconButton>
        </div>

        {topSlot ? <div className="px-3 pb-4">{topSlot}</div> : null}

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          {nav.map((group) => (
            <div key={group.title}>
              <div className="mb-2 px-3 text-[11px] font-medium text-muted-foreground">{group.title}</div>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end ?? item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] leading-none transition-all',
                          isActive
                            ? 'bg-primary font-medium text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.count ? (
                            <span
                              className={cn(
                                'min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none',
                                isActive
                                  ? 'bg-primary-foreground/15 text-primary-foreground'
                                  : 'bg-muted text-foreground',
                              )}
                            >
                              {item.count > 99 ? '99+' : item.count}
                            </span>
                          ) : null}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-border/60 p-3">
          {bottomSlot}

          {userSlot || onLogout || showSettings ? (
            <div className="relative flex items-center gap-3 rounded-xl border border-border bg-muted px-3 py-2.5">
              <div className="min-w-0 flex-1">{userSlot}</div>
              {showSettings ? (
                <SettingsMenu panelClassName="left-0 right-0 w-auto" onLogout={onLogout} />
              ) : null}
            </div>
          ) : null}
        </div>
      </aside>
    </>
  )
}

/** Avatar + name block for the sidebar's user card. */
export function SidebarUser({ name, detail }: { name: string; detail?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-[12px] font-medium text-background">
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium leading-none text-foreground">{name}</div>
        {detail ? <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{detail}</div> : null}
      </div>
    </div>
  )
}

/** Search affordance styled as a muted input with a ⌘K chip. */
export function SidebarSearch({
  placeholder,
  onClick,
}: {
  placeholder?: string
  onClick?: () => void
}) {
  const labels = useUiLabels()
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-2 rounded-lg border border-transparent bg-muted px-3 py-2 text-left transition-colors hover:border-border"
    >
      <Search size={14} className="text-muted-foreground transition-colors group-hover:text-foreground" />
      <span className="flex-1 truncate text-[13px] text-muted-foreground">
        {placeholder ?? labels.search}
      </span>
      <span className="hidden items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground xl:flex">
        ⌘K
      </span>
    </button>
  )
}
