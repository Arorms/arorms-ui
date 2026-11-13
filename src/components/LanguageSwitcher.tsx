import { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useOptionalLanguage } from '@arorms/core'
import { cn } from '../cn.ts'

/**
 * Language pill + dropdown. Renders nothing when the project has not mounted `I18nProvider`, so it
 * is safe to drop into `AppShell` unconditionally.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const i18n = useOptionalLanguage()
  const [open, setOpen] = useState(false)

  if (!i18n) return null

  const { language, setLanguage, languages } = i18n
  const codes = Object.keys(languages) as string[]

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Globe size={12} />
        <span className="hidden sm:inline">{languages[language]?.label ?? language}</span>
        <ChevronDown size={12} />
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            className="absolute right-0 top-full z-50 mt-2 w-28 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            {codes.map((code) => (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={language === code}
                onClick={() => {
                  setLanguage(code)
                  setOpen(false)
                }}
                className={cn(
                  'w-full border-b border-border px-4 py-2 text-left text-[12px] font-medium transition-colors last:border-0',
                  language === code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {languages[code]?.label ?? code}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
