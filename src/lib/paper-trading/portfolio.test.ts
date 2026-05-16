import { describe, expect, it } from 'vitest'

import {
  buildPositionView,
  calculateOrderPreview,
  positionPnl,
  summarisePortfolio,
  weightedAvgCost,
} from '@/lib/paper-trading/portfolio'

describe('weightedAvgCost', () => {
  it('blends an added fill into the existing cost basis', () => {
    expect(weightedAvgCost(1, 100, 1, 200)).toBe(150)
  })

  it('returns the fill price when there is no prior position', () => {
    expect(weightedAvgCost(0, 0, 2, 75)).toBe(75)
  })

  it('returns 0 when total quantity is non-positive', () => {
    expect(weightedAvgCost(0, 0, 0, 100)).toBe(0)
  })
})

describe('calculateOrderPreview', () => {
  it('prices a buy as notional + fee (matches the design mock)', () => {
    const p = calculateOrderPreview({ side: 'buy', notional: 250, price: 64210 })
    expect(p.quantity).toBeCloseTo(250 / 64210, 10)
    expect(p.fee).toBeCloseTo(0.25, 10)
    expect(p.total).toBeCloseTo(250.25, 10)
  })

  it('prices a sell as net proceeds (notional − fee)', () => {
    const p = calculateOrderPreview({ side: 'sell', notional: 1000, price: 50 })
    expect(p.quantity).toBe(20)
    expect(p.fee).toBeCloseTo(1, 10)
    expect(p.total).toBeCloseTo(999, 10)
  })

  it('returns zeros for an invalid price or notional', () => {
    expect(calculateOrderPreview({ side: 'buy', notional: 100, price: 0 })).toEqual({
      quantity: 0,
      fee: 0,
      total: 0,
    })
    expect(calculateOrderPreview({ side: 'buy', notional: 0, price: 100 })).toEqual({
      quantity: 0,
      fee: 0,
      total: 0,
    })
  })
})

describe('positionPnl', () => {
  it('computes market value and unrealised P&L against a live price', () => {
    expect(positionPnl(2, 100, 120)).toEqual({
      marketValue: 240,
      unrealizedPnl: 40,
      unrealizedPnlPct: 20,
    })
  })

  it('values a stale (null) price at cost so totals stay sane', () => {
    expect(positionPnl(2, 100, null)).toEqual({
      marketValue: 200,
      unrealizedPnl: 0,
      unrealizedPnlPct: 0,
    })
  })
})

describe('summarisePortfolio', () => {
  it('aggregates cash + holdings and rolls up realised P&L', () => {
    const position = buildPositionView({
      symbol: 'BTC',
      name: 'Bitcoin',
      kind: 'crypto',
      quantity: 0.1,
      avgCost: 50000,
      realizedPnl: 100,
      price: 60000,
    })

    const view = summarisePortfolio(10_000, 5_000, [position])

    expect(position.marketValue).toBeCloseTo(6000, 6)
    expect(view.holdingsValue).toBeCloseTo(6000, 6)
    expect(view.totalValue).toBeCloseTo(11_000, 6)
    expect(view.totalPnl).toBeCloseTo(1_000, 6)
    expect(view.totalPnlPct).toBeCloseTo(10, 6)
    expect(view.realizedPnl).toBe(100)
  })
})
