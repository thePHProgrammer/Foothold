import { describe, expect, it } from 'vitest'

import { isTradableSymbol } from '@/lib/watchlist/symbols'

describe('isTradableSymbol', () => {
  it('accepts catalog symbols', () => {
    expect(isTradableSymbol('BTC')).toBe(true)
    expect(isTradableSymbol('AAPL')).toBe(true)
    expect(isTradableSymbol('EURUSD')).toBe(true)
  })

  it('rejects unknown symbols', () => {
    expect(isTradableSymbol('DOGE')).toBe(false)
    expect(isTradableSymbol('')).toBe(false)
  })

  it('is case-sensitive (catalog is upper-case)', () => {
    expect(isTradableSymbol('btc')).toBe(false)
  })
})
