/**
 * Display formatting for paper-trading USD amounts and asset quantities.
 * Pure — safe on client or server.
 */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return usd.format(value)
}

/** Signed USD for P&L (e.g. "+$24.21" / "−$8.40"). Uses a true minus sign. */
export function formatSignedUsd(value: number): string {
  if (!Number.isFinite(value)) return '—'
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${usd.format(Math.abs(value))}`
}

/** Asset quantity — up to 6 dp, trailing zeros trimmed, grouped thousands. */
export function formatQty(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value)
}
