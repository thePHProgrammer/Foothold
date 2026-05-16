import { Prisma } from '@prisma/client'

import { prisma } from '@/server/db'
import { logger } from '@/lib/logger'

/**
 * Persistence-only layer for paper trading. NO money math here — the service
 * computes every value with the pure helpers in
 * `@/lib/paper-trading/portfolio` and hands fully-resolved numbers to these
 * functions. Writes use the array form of `$transaction` (NOT the callback
 * form) — required for Neon's pooled PgBouncer connection (mirrors
 * `onboarding.repository.ts`). Do not "improve" this to the callback form.
 *
 * TODO(concurrency): getPortfolio → service compute → applyTrade is a
 * read-then-write window. A user double-clicking Buy could have two requests
 * read the same balance and both succeed. Acceptable for a single-user
 * educational sim; revisit with an optimistic-version column if this ever
 * becomes multi-actor or high-frequency.
 */

const toNum = (d: Prisma.Decimal) => d.toNumber()

export type PortfolioRow = {
  id: string
  userId: string
  startingCash: number
  cashBalance: number
}

export type PositionRow = {
  symbol: string
  quantity: number
  avgCost: number
  realizedPnl: number
}

export type TradeRow = {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  fee: number
  total: number
  provider: string | null
  createdAt: Date
}

export type PortfolioWithRelations = PortfolioRow & {
  positions: PositionRow[]
  trades: TradeRow[]
}

export async function getPortfolio(
  userId: string,
  recentTradeLimit = 10
): Promise<PortfolioWithRelations | null> {
  const portfolio = await prisma.paperPortfolio.findUnique({
    where: { userId },
    include: {
      positions: { orderBy: { symbol: 'asc' } },
      trades: { orderBy: { createdAt: 'desc' }, take: recentTradeLimit },
    },
  })
  if (!portfolio) return null

  return {
    id: portfolio.id,
    userId: portfolio.userId,
    startingCash: toNum(portfolio.startingCash),
    cashBalance: toNum(portfolio.cashBalance),
    positions: portfolio.positions.map((p) => ({
      symbol: p.symbol,
      quantity: toNum(p.quantity),
      avgCost: toNum(p.avgCost),
      realizedPnl: toNum(p.realizedPnl),
    })),
    trades: portfolio.trades.map((t) => ({
      id: t.id,
      symbol: t.symbol,
      side: t.side,
      quantity: toNum(t.quantity),
      price: toNum(t.price),
      fee: toNum(t.fee),
      total: toNum(t.total),
      provider: t.provider,
      createdAt: t.createdAt,
    })),
  }
}

/** Creates the portfolio, or resets cash if one somehow already exists. */
export async function createPortfolio(userId: string, startingCash: number): Promise<PortfolioRow> {
  try {
    const portfolio = await prisma.paperPortfolio.upsert({
      where: { userId },
      create: { userId, startingCash, cashBalance: startingCash },
      update: { startingCash, cashBalance: startingCash },
    })
    return {
      id: portfolio.id,
      userId: portfolio.userId,
      startingCash: toNum(portfolio.startingCash),
      cashBalance: toNum(portfolio.cashBalance),
    }
  } catch (error) {
    logger.error('Failed to create paper portfolio', { error, userId })
    throw error
  }
}

/** Deletes the portfolio; Cascade removes its positions and trades. */
export async function deletePortfolio(userId: string): Promise<void> {
  try {
    await prisma.paperPortfolio.deleteMany({ where: { userId } })
  } catch (error) {
    logger.error('Failed to delete paper portfolio', { error, userId })
    throw error
  }
}

/**
 * Persists one executed trade as an atomic array `$transaction`:
 *   [ portfolio cash update, position upsert, trade insert ].
 * All values are pre-computed by the service. A fully-closed position is
 * written with quantity 0 (row retained for realised-P&L history).
 */
export async function applyTrade(args: {
  portfolioId: string
  newCashBalance: number
  position: { symbol: string; quantity: number; avgCost: number; realizedPnl: number }
  trade: {
    symbol: string
    side: 'buy' | 'sell'
    quantity: number
    price: number
    fee: number
    total: number
    provider: string | null
  }
}): Promise<TradeRow> {
  const { portfolioId, newCashBalance, position, trade } = args

  try {
    const cashUpdate = prisma.paperPortfolio.update({
      where: { id: portfolioId },
      data: { cashBalance: newCashBalance },
    })

    const positionUpsert = prisma.paperPosition.upsert({
      where: { portfolioId_symbol: { portfolioId, symbol: position.symbol } },
      create: {
        portfolioId,
        symbol: position.symbol,
        quantity: position.quantity,
        avgCost: position.avgCost,
        realizedPnl: position.realizedPnl,
      },
      update: {
        quantity: position.quantity,
        avgCost: position.avgCost,
        realizedPnl: position.realizedPnl,
      },
    })

    const tradeCreate = prisma.paperTrade.create({
      data: {
        portfolioId,
        symbol: trade.symbol,
        side: trade.side,
        quantity: trade.quantity,
        price: trade.price,
        fee: trade.fee,
        total: trade.total,
        provider: trade.provider,
      },
    })

    const [, , created] = await prisma.$transaction([cashUpdate, positionUpsert, tradeCreate])

    return {
      id: created.id,
      symbol: created.symbol,
      side: created.side,
      quantity: toNum(created.quantity),
      price: toNum(created.price),
      fee: toNum(created.fee),
      total: toNum(created.total),
      provider: created.provider,
      createdAt: created.createdAt,
    }
  } catch (error) {
    logger.error('Failed to apply paper trade', {
      error,
      portfolioId,
      symbol: trade.symbol,
      side: trade.side,
    })
    throw error
  }
}
