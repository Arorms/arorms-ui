import { Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../cn.ts'
import { useUiLabels } from '../labels.tsx'
import { IconButton } from '../components/Button.tsx'

export interface HeaderProps {
  /** Mobile drawer trigger. */
  onMenu: () => void
  /** Breadcrumb / page context line on the left. */
  title?: ReactNode
  /** Right-hand slot: language switcher, account menu, page actions. */
  right?: ReactNode
  className?: string
}

/** 56px sticky bar with a translucent canvas and a bottom hairline. */
export function Header({ onMenu, title, right, className }: HeaderProps) {
  const labels = useUiLabels()
  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-[56px] items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-8',
        className,
      )}
    >
      <IconButton
        onClick={onMenu}
        aria-label={labels.openMenu}
        className="-ml-2 lg:hidden"
      >
        <Menu size={18} />
      </IconButton>
      <div className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">{title}</div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </header>
  )
}
