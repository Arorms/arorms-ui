import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind conflict resolution. Only for merging — never a style engine.
 * Because `theme.css` overrides Tailwind's own token names instead of inventing new ones, the
 * default `tailwind-merge` configuration recognises every class used here.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs))
}
