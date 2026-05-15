import { logger } from '@/lib/logger'

export type ProviderQuote = {
  symbol: string
  price: number | null
  change24hPct: number | null
  sparkline?: number[]
  source: 'coingecko' | 'finnhub'
  fetchedAt: string
}

type CoinGeckoMarketResponse = {
  id: string
  symbol: string
  current_price: number | null
  price_change_percentage_24h: number | null
  sparkline_in_7d?: { price: number[] }
}

const ENDPOINT = 'https://api.coingecko.com/api/v3/coins/markets'

/**
 * Fetches normalised quotes for the given CoinGecko ids. Single call to
 * /coins/markets returns all symbols, sparkline (7-day, 168 points), and
 * 24h percentage change.
 *
 * Caller is expected to map `id -> app symbol` since CoinGecko `symbol`
 * field is not unique (e.g. multiple tokens share "usdc").
 */
export async function fetchCoinGeckoQuotes(
  idToSymbol: Record<string, string>
): Promise<ProviderQuote[]> {
  const ids = Object.keys(idToSymbol)
  if (ids.length === 0) return []

  const url = new URL(ENDPOINT)
  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('ids', ids.join(','))
  url.searchParams.set('sparkline', 'true')
  url.searchParams.set('price_change_percentage', '24h')
  url.searchParams.set('per_page', String(ids.length))

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { accept: 'application/json' },
  })

  if (!res.ok) {
    if (res.status === 429) {
      logger.error('CoinGecko rate limited', { status: 429 })
    } else {
      logger.error('CoinGecko fetch failed', { status: res.status })
    }
    throw new Error(`CoinGecko ${res.status}`)
  }

  const data = (await res.json()) as CoinGeckoMarketResponse[]
  const fetchedAt = new Date().toISOString()

  return data.map<ProviderQuote>((row) => {
    const sparklinePoints = row.sparkline_in_7d?.price ?? []
    // Reduce 168 points to 24 for a cleaner sparkline
    const sampled =
      sparklinePoints.length > 24 ? sampleEvenly(sparklinePoints, 24) : sparklinePoints
    return {
      symbol: idToSymbol[row.id] ?? row.id.toUpperCase(),
      price: row.current_price,
      change24hPct: row.price_change_percentage_24h,
      sparkline: sampled.length > 0 ? sampled : undefined,
      source: 'coingecko',
      fetchedAt,
    }
  })
}

function sampleEvenly(arr: number[], target: number): number[] {
  if (arr.length <= target) return arr
  const step = arr.length / target
  const out: number[] = []
  for (let i = 0; i < target; i += 1) {
    const v = arr[Math.floor(i * step)]
    if (typeof v === 'number') out.push(v)
  }
  return out
}
