import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type Theme } from '@arorms/core'
import { useUiLabels } from '../labels.tsx'
import { Segmented, type SegmentedOption } from './Segmented.tsx'

/**
 * Three-segment pill: system / light / dark. Reads `useTheme()` from `@arorms/core`; the package
 * only owns the control, the provider owns the `.dark` class.
 *
 * Built on `Segmented` so the theme control and every other segmented control stay identical.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const labels = useUiLabels()

  const options: SegmentedOption<Theme>[] = [
    { value: 'system', icon: <Monitor size={12} />, label: <span className="hidden xl:inline">{labels.themeSystem}</span>, title: labels.themeSystem },
    { value: 'light', icon: <Sun size={12} />, label: <span className="hidden xl:inline">{labels.themeLight}</span>, title: labels.themeLight },
    { value: 'dark', icon: <Moon size={12} />, label: <span className="hidden xl:inline">{labels.themeDark}</span>, title: labels.themeDark },
  ]

  return (
    <Segmented
      ariaLabel="Theme"
      size="sm"
      options={options}
      value={theme}
      onChange={setTheme}
      className={className}
    />
  )
}
