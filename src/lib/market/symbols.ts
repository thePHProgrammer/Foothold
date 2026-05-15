export type Topic = 'crypto' | 'stocks' | 'forex'
export type Kind = 'crypto' | 'stock' | 'forex'

export type MarketSession = 'open' | 'closed' | 'weekend'

export type SymbolDef =
  | { symbol: string; name: string; kind: 'crypto'; topic: Topic; cgId: string }
  | { symbol: string; name: string; kind: 'stock'; topic: Topic; finnhubSym: string }
  | {
      symbol: string
      name: string
      kind: 'forex'
      topic: Topic
      finnhubPair: string
      invert?: boolean
    }

export const SYMBOLS: SymbolDef[] = [
  { symbol: 'BTC', name: 'Bitcoin', kind: 'crypto', topic: 'crypto', cgId: 'bitcoin' },
  { symbol: 'ETH', name: 'Ethereum', kind: 'crypto', topic: 'crypto', cgId: 'ethereum' },
  { symbol: 'SOL', name: 'Solana', kind: 'crypto', topic: 'crypto', cgId: 'solana' },
  { symbol: 'XRP', name: 'XRP', kind: 'crypto', topic: 'crypto', cgId: 'ripple' },
  { symbol: 'USDC', name: 'USD Coin', kind: 'crypto', topic: 'crypto', cgId: 'usd-coin' },
  { symbol: 'AAPL', name: 'Apple', kind: 'stock', topic: 'stocks', finnhubSym: 'AAPL' },
  { symbol: 'MSFT', name: 'Microsoft', kind: 'stock', topic: 'stocks', finnhubSym: 'MSFT' },
  { symbol: 'TSLA', name: 'Tesla', kind: 'stock', topic: 'stocks', finnhubSym: 'TSLA' },
  { symbol: 'SPY', name: 'S&P 500 ETF', kind: 'stock', topic: 'stocks', finnhubSym: 'SPY' },
  {
    symbol: 'EURUSD',
    name: 'EUR/USD',
    kind: 'forex',
    topic: 'forex',
    finnhubPair: 'OANDA:EUR_USD',
  },
  {
    symbol: 'GBPUSD',
    name: 'GBP/USD',
    kind: 'forex',
    topic: 'forex',
    finnhubPair: 'OANDA:GBP_USD',
  },
  {
    symbol: 'USDJPY',
    name: 'USD/JPY',
    kind: 'forex',
    topic: 'forex',
    finnhubPair: 'OANDA:USD_JPY',
  },
]

export const SYMBOLS_BY_SYMBOL: Record<string, SymbolDef> = Object.fromEntries(
  SYMBOLS.map((s) => [s.symbol, s])
)

export const CRYPTO_SYMBOLS = SYMBOLS.filter((s) => s.kind === 'crypto')
export const STOCK_SYMBOLS = SYMBOLS.filter((s) => s.kind === 'stock')
export const FOREX_SYMBOLS = SYMBOLS.filter((s) => s.kind === 'forex')

export const HERO_SYMBOLS = ['BTC', 'ETH', 'SPY']
export const TICKER_SYMBOLS = SYMBOLS.map((s) => s.symbol)

export function getSymbolsForTopic(topic: Topic, limit = 3): SymbolDef[] {
  return SYMBOLS.filter((s) => s.topic === topic).slice(0, limit)
}

/**
 * Pure helper — derives whether an instrument's market is currently open.
 * Approximate (rough US/global sessions; doesn't account for holidays).
 *   - crypto: always open
 *   - stock:  Mon–Fri 14:30–21:00 UTC (US session)
 *   - forex:  Sun 21:00 → Fri 21:00 UTC
 */
export function getMarketSession(kind: Kind, now: Date = new Date()): MarketSession {
  if (kind === 'crypto') return 'open'

  const day = now.getUTCDay() // 0 = Sun, 6 = Sat
  const hour = now.getUTCHours()
  const min = now.getUTCMinutes()
  const minsFromUtcMidnight = hour * 60 + min

  if (kind === 'stock') {
    if (day === 0 || day === 6) return 'weekend'
    const open = 14 * 60 + 30
    const close = 21 * 60
    return minsFromUtcMidnight >= open && minsFromUtcMidnight < close ? 'open' : 'closed'
  }

  // forex — opens Sun 21:00 UTC, closes Fri 21:00 UTC
  if (day === 6) return 'weekend'
  if (day === 0 && minsFromUtcMidnight < 21 * 60) return 'weekend'
  if (day === 5 && minsFromUtcMidnight >= 21 * 60) return 'weekend'
  return 'open'
}
