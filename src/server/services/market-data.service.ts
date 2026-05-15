import { logger } from '@/lib/logger'
import {
  CRYPTO_SYMBOLS,
  FOREX_SYMBOLS,
  STOCK_SYMBOLS,
  SYMBOLS,
  getMarketSession,
  type Kind,
  type MarketSession,
  type SymbolDef,
} from '@/lib/market/symbols'
import { fetchCoinGeckoQuotes, type ProviderQuote } from '@/server/providers/coingecko.provider'
import { fetchFinnhubForex, fetchFinnhubStock } from '@/server/providers/finnhub.provider'

export type QuoteFreshness = 'live' | 'delayed' | 'stale'

export type MarketPrice = {
  symbol: string
  name: string
  kind: Kind
  price: number | null
  change24hPct: number | null
  sparkline?: number[]
  provider: 'coingecko' | 'finnhub'
  freshness: QuoteFreshness
  session: MarketSession
  asOf: string
}

function quoteToPrice(quote: ProviderQuote, def: SymbolDef): MarketPrice {
  // Stocks via Finnhub free tier are delayed ~15 min; everything else is "live"-ish.
  const freshness: QuoteFreshness =
    def.kind === 'stock' && quote.source === 'finnhub' ? 'delayed' : 'live'

  return {
    symbol: def.symbol,
    name: def.name,
    kind: def.kind,
    price: quote.price,
    change24hPct: quote.change24hPct,
    sparkline: quote.sparkline,
    provider: quote.source,
    freshness: quote.price === null ? 'stale' : freshness,
    session: getMarketSession(def.kind),
    asOf: quote.fetchedAt,
  }
}

/**
 * Single source of truth for fallback rows. Every rejected fan-out branch and
 * every gap in upstream data funnels through this helper so stale objects
 * stay consistent across providers as the set grows.
 */
function staleQuote(def: SymbolDef): MarketPrice {
  return {
    symbol: def.symbol,
    name: def.name,
    kind: def.kind,
    price: null,
    change24hPct: null,
    provider: def.kind === 'crypto' ? 'coingecko' : 'finnhub',
    freshness: 'stale',
    session: getMarketSession(def.kind),
    asOf: new Date().toISOString(),
  }
}

async function loadCrypto(): Promise<MarketPrice[]> {
  const idToSymbol: Record<string, string> = {}
  for (const def of CRYPTO_SYMBOLS) {
    if (def.kind === 'crypto') idToSymbol[def.cgId] = def.symbol
  }

  try {
    const quotes = await fetchCoinGeckoQuotes(idToSymbol)
    const bySymbol = new Map(quotes.map((q) => [q.symbol, q]))
    return CRYPTO_SYMBOLS.map((def) => {
      const q = bySymbol.get(def.symbol)
      return q ? quoteToPrice(q, def) : staleQuote(def)
    })
  } catch (error) {
    logger.error('Crypto fan-out failed', { error: serialiseError(error) })
    return CRYPTO_SYMBOLS.map(staleQuote)
  }
}

async function loadStocks(): Promise<MarketPrice[]> {
  const results = await Promise.allSettled(
    STOCK_SYMBOLS.map((def) =>
      def.kind === 'stock'
        ? fetchFinnhubStock(def.symbol, def.finnhubSym).then((q) => quoteToPrice(q, def))
        : Promise.reject(new Error('unexpected non-stock def'))
    )
  )

  return STOCK_SYMBOLS.map((def, i) => {
    const r = results[i]
    if (r?.status === 'fulfilled') return r.value
    if (r?.status === 'rejected') {
      logger.error('Stock fetch rejected', { symbol: def.symbol, reason: serialiseError(r.reason) })
    }
    return staleQuote(def)
  })
}

async function loadForex(): Promise<MarketPrice[]> {
  const pairs = FOREX_SYMBOLS.flatMap((def) => {
    if (def.kind !== 'forex') return []
    // Derive the "quote currency" Finnhub returns under /forex/rates?base=USD.
    // For USDJPY → key 'JPY' (direct). For EURUSD/GBPUSD → key 'EUR'/'GBP' (invert).
    const isUsdBase = def.symbol.startsWith('USD')
    const quoteCcy = isUsdBase ? def.symbol.slice(3) : def.symbol.slice(0, 3)
    return [{ appSymbol: def.symbol, quoteCcy, invert: !isUsdBase }]
  })

  try {
    const quotes = await fetchFinnhubForex(pairs)
    const bySymbol = new Map(quotes.map((q) => [q.symbol, q]))
    return FOREX_SYMBOLS.map((def) => {
      const q = bySymbol.get(def.symbol)
      return q ? quoteToPrice(q, def) : staleQuote(def)
    })
  } catch (error) {
    logger.error('Forex fan-out failed', { error: serialiseError(error) })
    return FOREX_SYMBOLS.map(staleQuote)
  }
}

function serialiseError(e: unknown): string {
  if (e instanceof Error) return e.message
  return String(e)
}

/**
 * Fan-out across the three provider branches. One slow or failing branch never
 * blocks or blanks the others. Result preserves catalog order.
 */
export async function getAllMarketPrices(): Promise<MarketPrice[]> {
  const [crypto, stocks, forex] = await Promise.all([loadCrypto(), loadStocks(), loadForex()])

  const bySymbol = new Map<string, MarketPrice>()
  for (const p of [...crypto, ...stocks, ...forex]) bySymbol.set(p.symbol, p)

  return SYMBOLS.map((def) => bySymbol.get(def.symbol) ?? staleQuote(def))
}

export async function getPricesFor(symbols: string[]): Promise<MarketPrice[]> {
  const requested = new Set(symbols)
  const all = await getAllMarketPrices()
  return all.filter((p) => requested.has(p.symbol))
}
