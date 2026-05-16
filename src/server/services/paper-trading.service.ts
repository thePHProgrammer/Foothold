import { SYMBOLS_BY_SYMBOL } from '@/lib/market/symbols'
import { type OrderErrorCode } from '@/lib/paper-trading/constants'
import {
  buildPositionView,
  calculateOrderPreview,
  summarisePortfolio,
  weightedAvgCost,
  type PortfolioView,
} from '@/lib/paper-trading/portfolio'
import type { PlaceOrderInput } from '@/lib/validations/paper-trading'
import * as paperTradingRepo from '@/server/repositories/paper-trading.repository'
import type { TradeRow } from '@/server/repositories/paper-trading.repository'
import { getPricesFor, type MarketPrice } from '@/server/services/market-data.service'

const DEFAULT_SYMBOL = 'BTC'

/** Tolerance so a "sell all" doesn't get rejected by float rounding. */
const QTY_EPSILON = 1e-9

export type { TradeRow } from '@/server/repositories/paper-trading.repository'

export type PracticeScreenData = {
  portfolioView: PortfolioView
  selectedQuote: MarketPrice
  recentTrades: TradeRow[]
}

export type OrderResult = { ok: true; trade: TradeRow } | { ok: false; code: OrderErrorCode }

/** Falls back to a known catalog symbol if the URL param is bogus. */
export function resolveSelectedSymbol(symbol: string | undefined): string {
  return symbol && symbol in SYMBOLS_BY_SYMBOL ? symbol : DEFAULT_SYMBOL
}

/**
 * The Practice page's single data entry point. Resolves ONE market snapshot
 * per request (held symbols + the selected symbol in a single
 * `getPricesFor` call), then builds the portfolio view and extracts the
 * selected quote from that same snapshot — no duplicate provider fetches.
 */
export async function getPracticeScreenData(
  userId: string,
  selectedSymbol: string
): Promise<PracticeScreenData | null> {
  const portfolio = await paperTradingRepo.getPortfolio(userId)
  if (!portfolio) return null

  const heldSymbols = portfolio.positions.filter((p) => p.quantity > 0).map((p) => p.symbol)
  const wanted = Array.from(new Set([...heldSymbols, selectedSymbol]))

  const prices = await getPricesFor(wanted)
  const priceBySymbol = new Map(prices.map((p) => [p.symbol, p]))

  const positions = portfolio.positions
    .filter((p) => p.quantity > 0)
    .map((p) => {
      const def = SYMBOLS_BY_SYMBOL[p.symbol]
      const quote = priceBySymbol.get(p.symbol)
      return buildPositionView({
        symbol: p.symbol,
        name: def?.name ?? p.symbol,
        kind: def?.kind ?? 'crypto',
        quantity: p.quantity,
        avgCost: p.avgCost,
        realizedPnl: p.realizedPnl,
        price: quote?.price ?? null,
      })
    })

  const portfolioView = summarisePortfolio(portfolio.startingCash, portfolio.cashBalance, positions)

  const selectedQuote =
    priceBySymbol.get(selectedSymbol) ?? (await getPricesFor([selectedSymbol]))[0]

  // selectedSymbol is always a valid catalog symbol (resolveSelectedSymbol),
  // so getPricesFor returns a row (a stale row if the provider failed).
  if (!selectedQuote) return null

  return { portfolioView, selectedQuote, recentTrades: portfolio.trades }
}

export async function setupPortfolio(userId: string, startingCash: number): Promise<void> {
  await paperTradingRepo.createPortfolio(userId, startingCash)
}

/** Reset = delete; the page then naturally falls back to the setup screen. */
export async function resetPortfolio(userId: string): Promise<void> {
  await paperTradingRepo.deletePortfolio(userId)
}

/**
 * Executes a market order. All money math runs here via the pure helpers
 * BEFORE any DB write; the repository only persists the resolved numbers.
 */
export async function executeOrder(userId: string, input: PlaceOrderInput): Promise<OrderResult> {
  const portfolio = await paperTradingRepo.getPortfolio(userId)
  if (!portfolio) return { ok: false, code: 'PORTFOLIO_NOT_FOUND' }

  const [quote] = await getPricesFor([input.symbol])
  if (!quote || quote.price === null) {
    return { ok: false, code: 'STALE_PRICE' }
  }
  const price = quote.price

  const existing = portfolio.positions.find((p) => p.symbol === input.symbol)

  if (input.side === 'buy') {
    const preview = calculateOrderPreview({ side: 'buy', notional: input.notional, price })
    if (preview.quantity <= 0) {
      return { ok: false, code: 'INVALID_AMOUNT' }
    }
    if (preview.total > portfolio.cashBalance) {
      return { ok: false, code: 'INSUFFICIENT_CASH' }
    }

    const prevQty = existing?.quantity ?? 0
    const prevAvg = existing?.avgCost ?? 0
    const newQty = prevQty + preview.quantity
    const newAvg = weightedAvgCost(prevQty, prevAvg, preview.quantity, price)

    const trade = await paperTradingRepo.applyTrade({
      portfolioId: portfolio.id,
      newCashBalance: portfolio.cashBalance - preview.total,
      position: {
        symbol: input.symbol,
        quantity: newQty,
        avgCost: newAvg,
        realizedPnl: existing?.realizedPnl ?? 0,
      },
      trade: {
        symbol: input.symbol,
        side: 'buy',
        quantity: preview.quantity,
        price,
        fee: preview.fee,
        total: preview.total,
        provider: quote.provider,
        symbolName: quote.name,
        kind: quote.kind,
      },
    })
    return { ok: true, trade }
  }

  // sell
  const heldQty = existing?.quantity ?? 0
  if (!existing || heldQty <= 0) {
    return { ok: false, code: 'INSUFFICIENT_QUANTITY' }
  }

  let sellQty = input.notional / price
  if (sellQty > heldQty * (1 + QTY_EPSILON)) {
    return { ok: false, code: 'INSUFFICIENT_QUANTITY' }
  }
  // Snap a near-exact request to a clean full close.
  if (sellQty >= heldQty * (1 - QTY_EPSILON)) sellQty = heldQty

  const proceedsNotional = sellQty * price
  const preview = calculateOrderPreview({ side: 'sell', notional: proceedsNotional, price })
  if (preview.quantity <= 0) {
    return { ok: false, code: 'INVALID_AMOUNT' }
  }

  const realizedThisSale = (price - existing.avgCost) * sellQty
  const remainingQty = heldQty - sellQty

  const trade = await paperTradingRepo.applyTrade({
    portfolioId: portfolio.id,
    newCashBalance: portfolio.cashBalance + preview.total,
    position: {
      symbol: input.symbol,
      quantity: remainingQty,
      avgCost: existing.avgCost,
      realizedPnl: existing.realizedPnl + realizedThisSale,
    },
    trade: {
      symbol: input.symbol,
      side: 'sell',
      quantity: sellQty,
      price,
      fee: preview.fee,
      total: preview.total,
      provider: quote.provider,
      symbolName: quote.name,
      kind: quote.kind,
    },
  })
  return { ok: true, trade }
}
