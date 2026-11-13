import { useEffect, useState } from 'react'
import {
  Check,
  Languages,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Settings2,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { useOptionalLanguage, useTheme, type Theme } from '@arorms/core'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'
import { IconButton } from './Button.tsx'

type Submenu = 'theme' | 'language'

/**
 * One gear, one popover. Appearance, language and sign-out live behind it, so the sidebar footer is
 * only the user card. Three rows, identical shape: icon + label. Sign-out alone is red.
 *
 * A row opens its second level on click — clicking it again closes it — and the second level
 * appears beside the menu. Both panels fade in; the root panel also fades out. Escape and an
 * outside click close everything.
 */
export function SettingsMenu({
  className,
  panelClassName,
  onLogout,
}: {
  className?: string
  /** Positioning/size classes for the panel; the caller owns the anchor. */
  panelClassName?: string
  onLogout?: () => void
}) {
  const labels = useUiLabels()
  const { theme, setTheme } = useTheme()
  const i18n = useOptionalLanguage()
  const [open, setOpen] = useState(false)
  const [submenu, setSubmenu] = useState<Submenu | null>(null)

  const close = () => {
    setOpen(false)
    setSubmenu(null)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (submenu) setSubmenu(null)
      else close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, submenu])

  const themeOptions: { value: Theme; label: string; icon: LucideIcon }[] = [
    { value: 'system', label: labels.themeSystem, icon: Monitor },
    { value: 'light', label: labels.themeLight, icon: Sun },
    { value: 'dark', label: labels.themeDark, icon: Moon },
  ]
  const languages = i18n ? (Object.keys(i18n.languages) as string[]) : []

  return (
    <div className={className}>
      <IconButton
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={labels.settings}
        title={labels.settings}
      >
        <Settings2 size={14} />
      </IconButton>

      {open ? (
        <button
          type="button"
          aria-label={labels.close}
          tabIndex={-1}
          className="fixed inset-0 z-40 cursor-default"
          onClick={close}
        />
      ) : null}

      <div
        role="menu"
        aria-label={labels.settings}
        className={cn(
          'absolute right-0 bottom-full z-50 mb-2 w-52 origin-bottom-right rounded-xl border border-border bg-card p-1.5 shadow-sm dark:shadow-none',
          'transition-[opacity,transform] duration-150 ease-out',
          open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-1 scale-95 opacity-0',
          panelClassName,
        )}
      >
        <MenuRow
          icon={Languages}
          label={labels.language}
          opens
          expanded={submenu === 'language'}
          onClick={() => setSubmenu(submenu === 'language' ? null : 'language')}
        >
          {submenu === 'language' ? (
            <Flyout>
              {languages.length > 0 ? (
                languages.map((code) => (
                  <MenuRow
                    key={code}
                    label={i18n?.languages[code]?.label ?? code}
                    selected={i18n?.language === code}
                    onClick={() => {
                      i18n?.setLanguage(code)
                      close()
                    }}
                  />
                ))
              ) : (
                <div className="px-2 py-1.5 text-[13px] text-muted-foreground">{labels.language}</div>
              )}
            </Flyout>
          ) : null}
        </MenuRow>

        <MenuRow
          icon={Palette}
          label={labels.appearance}
          opens
          expanded={submenu === 'theme'}
          onClick={() => setSubmenu(submenu === 'theme' ? null : 'theme')}
        >
          {submenu === 'theme' ? (
            <Flyout>
              {themeOptions.map((option) => (
                <MenuRow
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  selected={theme === option.value}
                  onClick={() => {
                    setTheme(option.value)
                    close()
                  }}
                />
              ))}
            </Flyout>
          ) : null}
        </MenuRow>

        {onLogout ? (
          <MenuRow
            icon={LogOut}
            label={labels.signOut}
            tone="danger"
            onClick={() => {
              close()
              void onLogout()
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

/** A menu row. Same height, same icon slot and same text alignment at both levels. */
function MenuRow({
  icon: Icon,
  label,
  opens,
  expanded,
  selected,
  tone,
  onClick,
  children,
}: {
  icon?: LucideIcon
  label: string
  /** Has a second level: `menuitem` semantics and a selected/open state. */
  opens?: boolean
  expanded?: boolean
  selected?: boolean
  tone?: 'danger'
  onClick: () => void
  children?: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        role={opens ? 'menuitem' : 'menuitemradio'}
        aria-haspopup={opens ? 'menu' : undefined}
        aria-expanded={opens ? expanded : undefined}
        aria-checked={opens ? undefined : (selected ?? false)}
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors',
          tone === 'danger'
            ? 'font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400'
            : expanded
              ? 'bg-muted text-foreground'
              : 'text-foreground hover:bg-muted',
        )}
      >
        {Icon ? <Icon size={14} strokeWidth={1.8} className="shrink-0" /> : null}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {selected ? <Check size={13} className="shrink-0 text-primary" /> : null}
      </button>
      {children}
    </div>
  )
}

/** Second level: a panel beside the row, aligned with the menu's top edge. */
function Flyout({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="menu"
      className="absolute top-0 left-full z-50 ml-1.5 w-32 animate-fade-in rounded-xl border border-border bg-card p-1.5 shadow-sm [animation-duration:140ms] dark:shadow-none"
    >
      {children}
    </div>
  )
}
