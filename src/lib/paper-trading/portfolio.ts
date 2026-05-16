import type { Kind } from '@/lib/market/symbols'
import { FEE_RATE } from '@/lib/paper-trading/constants'

/**
 * Pure paper-trading domain math. No I/O, no Prisma, no fetch — every function
 * here is deterministic so it can be unit-tested and reused identically by the
 * client order ticket and the server execution path. Money math lives here and
 * ONLY here.
 */

export type OrderSide = 'buy' | 'sell'

/** Result of pricing an order. Shared by ticket preview, execution and tests. */
export type OrderPreview = {
  /** Units of the asset transacted. */
  quantity: number
  /** Practice fee in USD. */
  fee: number
  /**
   * Cash that moves. Buy → total cost (notional + fee).
   * Sell → net proceeds (notional − fee).
   */
  total: number
}

export type PositionView = {
  symbol: string
  name: string
  kind: Kind
  quantity: number
  avgCost: number
  /** Latest known price, or null when the quote is stale. */
  price: number | null
  marketValue: number
  unrealizedPnl: number
  unrealizedPnlPct: number
  realizedPnl: number
}

export type PortfolioView = {
  startingCash: number
  cashBalance: number
  positions: PositionView[]
  holdingsValue: number
  totalValue: number
  totalPnl: number
  totalPnlPct: number
  realizedPnl: number
}

export type PortfolioSnapshot = {
  totalValue: number
  cashPct: number
  holdingsPct: number
  bestPerformer: PositionView | null
  worstPerformer: PositionView | null
}

/**
 * Weighted-average cost after adding `addQty` units at `addPrice` to an
 * existing position. Used on buys so cost basis stays accurate across
 * multiple fills.
 */
export function weightedAvgCost(
  prevQty: number,
  prevAvg: number,
  addQty: number,
  addPrice: number
): number {
  const totalQty = prevQty + addQty
  if (totalQty <= 0) return 0
  return (prevQty * prevAvg + addQty * addPrice) / totalQty
}

/**
 * Single source of fee/quantity math. `notional` is the USD the user wants to
 * spend (buy) or realise (sell). Imported by the client ticket AND the service
 * so the preview can never disagree with the executed trade.
 */
export function calculateOrderPreview(input: {
  side: OrderSide
  notional: number
  price: number
}): OrderPreview {
  const { side, notional, price } = input
  if (price <= 0 || notional <= 0) {
    return { quantity: 0, fee: 0, total: 0 }
  }

  const quantity = notional / price
  const fee = notional * FEE_RATE
  const total = side === 'buy' ? notional + fee : notional - fee

  return { quantity, fee, total }
}

/**
 * Per-position valuation. A stale quote (`price === null`) values the holding
 * at cost so portfolio totals stay sane and P&L reads zero rather than NaN.
 */
export function positionPnl(
  quantity: number,
  avgCost: number,
  price: number | null
): { marketValue: number; unrealizedPnl: number; unrealizedPnlPct: number } {
  const effectivePrice = price ?? avgCost
  const marketValue = quantity * effectivePrice
  const costBasis = quantity * avgCost
  const unrealizedPnl = marketValue - costBasis
  const unrealizedPnlPct = costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : 0
  return { marketValue, unrealizedPnl, unrealizedPnlPct }
}

/** Builds a fully-valued position row from raw holding data + a live quote. */
export function buildPositionView(input: {
  symbol: string
  name: string
  kind: Kind
  quantity: number
  avgCost: number
  realizedPnl: number
  price: number | null
}): PositionView {
  const { marketValue, unrealizedPnl, unrealizedPnlPct } = positionPnl(
    input.quantity,
    input.avgCost,
    input.price
  )
  return {
    symbol: input.symbol,
    name: input.name,
    kind: input.kind,
    quantity: input.quantity,
    avgCost: input.avgCost,
    price: input.price,
    marketValue,
    unrealizedPnl,
    unrealizedPnlPct,
    realizedPnl: input.realizedPnl,
  }
}

/** Aggregates cash + holdings into a portfolio view. */
export function summarisePortfolio(
  startingCash: number,
  cashBalance: number,
  positions: PositionView[]
): PortfolioView {
  const holdingsValue = positions.reduce((sum, p) => sum + p.marketValue, 0)
  const realizedPnl = positions.reduce((sum, p) => sum + p.realizedPnl, 0)
  const totalValue = cashBalance + holdingsValue
  const totalPnl = totalValue - startingCash
  const totalPnlPct = startingCash > 0 ? (totalPnl / startingCash) * 100 : 0

  return {
    startingCash,
    cashBalance,
    positions,
    holdingsValue,
    totalValue,
    totalPnl,
    totalPnlPct,
    realizedPnl,
  }
}

/**
 * Cheap dashboard abstraction (allocation + extremes). Reserved for the
 * Step 6/7 progress/journal screens; safe to leave unused this step.
 */
export function buildPortfolioSnapshot(view: PortfolioView): PortfolioSnapshot {
  const open = view.positions.filter((p) => p.quantity > 0)
  const totalValue = view.totalValue

  let bestPerformer: PositionView | null = null
  let worstPerformer: PositionView | null = null
  for (const p of open) {
    if (!bestPerformer || p.unrealizedPnlPct > bestPerformer.unrealizedPnlPct) {
      bestPerformer = p
    }
    if (!worstPerformer || p.unrealizedPnlPct < worstPerformer.unrealizedPnlPct) {
      worstPerformer = p
    }
  }

  return {
    totalValue,
    cashPct: totalValue > 0 ? (view.cashBalance / totalValue) * 100 : 0,
    holdingsPct: totalValue > 0 ? (view.holdingsValue / totalValue) * 100 : 0,
    bestPerformer,
    worstPerformer,
  }
}
