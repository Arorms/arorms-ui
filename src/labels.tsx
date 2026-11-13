import { createContext, useContext, useMemo, type ReactNode } from 'react'

/**
 * Every human-readable string in `@arorms/ui` comes from here, in English by default. Projects with
 * i18n wrap their tree in `<UiLabelsProvider labels={{ close: '关闭', … }}>`; the package itself
 * never guesses translation keys.
 */
export interface UiLabels {
  close: string
  cancel: string
  confirm: string
  loading: string
  empty: string
  previousPage: string
  nextPage: string
  openMenu: string
  closeMenu: string
  themeSystem: string
  themeLight: string
  themeDark: string
  settings: string
  appearance: string
  language: string
  signOut: string
  search: string
  clear: string
  retry: string
  back: string
  notProvided: string
}

export const defaultUiLabels: UiLabels = {
  close: 'Close',
  cancel: 'Cancel',
  confirm: 'Confirm',
  loading: 'Loading…',
  empty: 'Nothing here yet.',
  previousPage: 'Previous',
  nextPage: 'Next',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  themeSystem: 'Auto',
  themeLight: 'Light',
  themeDark: 'Dark',
  settings: 'Settings',
  appearance: 'Appearance',
  language: 'Language',
  signOut: 'Sign out',
  search: 'Search…',
  clear: 'Clear',
  retry: 'Try again',
  back: 'Back',
  notProvided: '—',
}

const UiLabelsContext = createContext<UiLabels>(defaultUiLabels)

export function UiLabelsProvider({
  labels,
  children,
}: {
  labels: Partial<UiLabels>
  children: ReactNode
}) {
  const value = useMemo(() => ({ ...defaultUiLabels, ...labels }), [labels])
  return <UiLabelsContext.Provider value={value}>{children}</UiLabelsContext.Provider>
}

export function useUiLabels(): UiLabels {
  return useContext(UiLabelsContext)
}

