import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

import type { ProviderQuote } from './coingecko.provider'

type FinnhubQuoteResponse = {
  c: number // current price
  d: number | null // daily change abs
  dp: number | null // daily change pct
  h: number
  l: number
  o: number
  pc: number
  t: number
}

type FinnhubForexResponse = {
  base: string
  quote: Record<string, number>
}

const QUOTE_ENDPOINT = 'https://finnhub.io/api/v1/quote'
const FOREX_ENDPOINT = 'https://finnhub.io/api/v1/forex/rates'

let warnedMissingKey = false

function hasKey(): boolean {
  if (!env.FINNHUB_API_KEY) {
    if (!warnedMissingKey) {
      logger.warn('FINNHUB_API_KEY missing — degrading to crypto-only')
      warnedMissingKey = true
    }
    return false
  }
  return true
}

export async function fetchFinnhubStock(
  appSymbol: string,
  finnhubSym: string
): Promise<ProviderQuote> {
  if (!hasKey()) throw new Error('FINNHUB_API_KEY not set')

  const url = new URL(QUOTE_ENDPOINT)
  url.searchParams.set('symbol', finnhubSym)
  url.searchParams.set('token', env.FINNHUB_API_KEY ?? '')

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { accept: 'application/json' },
  })

  if (!res.ok) {
    logger.error('Finnhub stock fetch failed', { symbol: finnhubSym, status: res.status })
    throw new Error(`Finnhub ${res.status}`)
  }

  const data = (await res.json()) as FinnhubQuoteResponse

  // Finnhub returns c:0 when the symbol is invalid / rate-limited
  if (!data || typeof data.c !== 'number' || data.c === 0) {
    throw new Error(`Finnhub returned empty quote for ${finnhubSym}`)
  }

  return {
    symbol: appSymbol,
    price: data.c,
    change24hPct: typeof data.dp === 'number' ? data.dp : null,
    source: 'finnhub',
    fetchedAt: new Date().toISOString(),
  }
}

/**
 * Returns quotes for the requested forex pairs in one call to /forex/rates?base=USD.
 * `pairMap` maps app symbol (e.g. 'EURUSD') to the underlying quote-currency code
 * Finnhub returns ('EUR' for EURUSD, 'JPY' for USDJPY).
 *
 * Rate convention: /forex/rates?base=USD returns rates as 1 USD = X target.
 *   - USD/JPY → directly returned (`rate['JPY']`)
 *   - EUR/USD → invert (`1 / rate['EUR']`)
 *   - GBP/USD → invert (`1 / rate['GBP']`)
 */
export async function fetchFinnhubForex(
  pairs: { appSymbol: string; quoteCcy: string; invert: boolean }[]
): Promise<ProviderQuote[]> {
  if (!hasKey()) throw new Error('FINNHUB_API_KEY not set')

  const url = new URL(FOREX_ENDPOINT)
  url.searchParams.set('base', 'USD')
  url.searchParams.set('token', env.FINNHUB_API_KEY ?? '')

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { accept: 'application/json' },
  })

  if (!res.ok) {
    logger.error('Finnhub forex fetch failed', { status: res.status })
    throw new Error(`Finnhub forex ${res.status}`)
  }

  const data = (await res.json()) as FinnhubForexResponse
  const fetchedAt = new Date().toISOString()

  return pairs.map<ProviderQuote>((pair) => {
    const raw = data.quote?.[pair.quoteCcy]
    let price: number | null = null
    if (typeof raw === 'number' && raw > 0) {
      price = pair.invert ? 1 / raw : raw
    }
    return {
      symbol: pair.appSymbol,
      price,
      change24hPct: null, // Finnhub free tier doesn't expose 24h forex change
      source: 'finnhub',
      fetchedAt,
    }
  })
}
