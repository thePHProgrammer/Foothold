import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merges Tailwind classes without conflicts. Use everywhere instead of raw className strings. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as currency (USD by default). */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/** Format a number as a percentage with sign. */
export function formatPercent(value: number, decimals = 2) {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/** Truncate a string to maxLength, appending ellipsis if needed. */
export function truncate(str: string, maxLength: number) {
  return str.length > maxLength ? `${str.slice(0, maxLength)}…` : str
}

/** Delay for ms milliseconds (use in tests / retry logic). */
export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/** Returns initials from a name string (e.g. "Maria Jones" → "MJ"). */
export function getInitials(name: string | null | undefined, fallback = '?') {
  if (!name) return fallback
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
