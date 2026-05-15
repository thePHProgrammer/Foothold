import type { Kind } from '@/lib/market/symbols'

export function formatPrice(value: number | null, kind: Kind, symbol?: string): string {
  if (value === null || Number.isNaN(value)) return '—'

  if (kind === 'crypto') {
    return value >= 1
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(value)
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumSignificantDigits: 4,
        }).format(value)
  }

  if (kind === 'stock') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const isJpy = symbol?.includes('JPY') ?? false
  return value.toFixed(isJpy ? 2 : 4)
}

export function formatPct(pct: number | null): string {
  if (pct === null || Number.isNaN(pct)) return '—'
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function formatAsOf(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(
      new Date(iso)
    )
  } catch {
    return ''
  }
}
