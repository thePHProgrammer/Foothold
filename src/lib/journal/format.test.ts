import { describe, expect, it } from 'vitest'

import { formatTradeSnapshot } from '@/lib/journal/format'

describe('formatTradeSnapshot', () => {
  it('formats a buy with grouped USD and trimmed quantity', () => {
    expect(
      formatTradeSnapshot({ side: 'buy', quantity: 0.0123, symbol: 'BTC', price: 64210 })
    ).toBe('BUY 0.0123 BTC @ $64,210.00')
  })

  it('formats a sell and uppercases the side', () => {
    expect(formatTradeSnapshot({ side: 'sell', quantity: 5, symbol: 'AAPL', price: 187.5 })).toBe(
      'SELL 5 AAPL @ $187.50'
    )
  })
})
