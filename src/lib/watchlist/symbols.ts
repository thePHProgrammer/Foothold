import { SYMBOLS_BY_SYMBOL } from '@/lib/market/symbols'

/**
 * Pure, deterministic catalog-membership check. Used by the zod refine and
 * the service so a symbol is validated server-side from one source of truth.
 */
export function isTradableSymbol(symbol: string): boolean {
  return symbol in SYMBOLS_BY_SYMBOL
}
