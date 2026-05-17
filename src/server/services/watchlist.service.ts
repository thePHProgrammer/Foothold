import { type WatchlistErrorCode, MAX_WATCHLIST } from '@/lib/watchlist/constants'
import { isTradableSymbol } from '@/lib/watchlist/symbols'
import { fetchMarketNews, type NewsArticle } from '@/server/providers/finnhub-news.provider'
import * as watchlistRepo from '@/server/repositories/watchlist.repository'
import { getPricesFor, type MarketPrice } from '@/server/services/market-data.service'

export type { NewsArticle } from '@/server/providers/finnhub-news.provider'

export type WatchlistResult = { ok: true } | { ok: false; code: WatchlistErrorCode }

export type WatchlistScreenData = {
  prices: MarketPrice[]
  news: NewsArticle[]
  newsAvailable: boolean
}

/** Watched tickers — used by `/markets` to render the star toggle state. */
export async function getWatchedSymbols(userId: string): Promise<string[]> {
  return watchlistRepo.listSymbols(userId)
}

export async function getWatchlistScreenData(userId: string): Promise<WatchlistScreenData> {
  const symbols = await watchlistRepo.listSymbols(userId)

  // getPricesFor returns catalog order; re-sort to the user's add order.
  const quotes = symbols.length > 0 ? await getPricesFor(symbols) : []
  const bySymbol = new Map(quotes.map((q) => [q.symbol, q]))
  const prices = symbols
    .map((s) => bySymbol.get(s))
    .filter((q): q is MarketPrice => q !== undefined)

  let news: NewsArticle[] = []
  let newsAvailable = false
  try {
    news = await fetchMarketNews()
    newsAvailable = true
  } catch {
    // No API key / upstream failure — degrade gracefully (Step 3 precedent).
    news = []
    newsAvailable = false
  }

  return { prices, news, newsAvailable }
}

export async function addSymbol(userId: string, symbol: string): Promise<WatchlistResult> {
  if (!isTradableSymbol(symbol)) return { ok: false, code: 'UNKNOWN_SYMBOL' }

  const current = await watchlistRepo.listSymbols(userId)
  if (current.includes(symbol)) return { ok: true } // idempotent
  if (current.length >= MAX_WATCHLIST) return { ok: false, code: 'LIMIT_REACHED' }

  await watchlistRepo.add(userId, symbol)
  return { ok: true }
}

export async function removeSymbol(userId: string, symbol: string): Promise<WatchlistResult> {
  await watchlistRepo.remove(userId, symbol)
  return { ok: true }
}
