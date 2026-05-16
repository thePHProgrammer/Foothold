import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

/**
 * Finnhub general market news. Mirrors `finnhub.provider.ts`: guarded by an
 * optional API key (warn once, throw when absent so the service can degrade
 * gracefully) and cached via the Next fetch cache. News changes slower than
 * quotes → a longer revalidate window.
 */

export type NewsArticle = {
  id: string
  headline: string
  summary: string
  source: string
  url: string
  imageUrl: string | null
  /** ISO 8601 */
  publishedAt: string
}

type FinnhubNewsItem = {
  category: string
  datetime: number // unix seconds
  headline: string
  id: number
  image: string
  related: string
  source: string
  summary: string
  url: string
}

const NEWS_ENDPOINT = 'https://finnhub.io/api/v1/news'
const MAX_ARTICLES = 20

let warnedMissingKey = false

function hasKey(): boolean {
  if (!env.FINNHUB_API_KEY) {
    if (!warnedMissingKey) {
      logger.warn('FINNHUB_API_KEY missing — market news unavailable')
      warnedMissingKey = true
    }
    return false
  }
  return true
}

export async function fetchMarketNews(): Promise<NewsArticle[]> {
  if (!hasKey()) throw new Error('FINNHUB_API_KEY not set')

  const url = new URL(NEWS_ENDPOINT)
  url.searchParams.set('category', 'general')
  url.searchParams.set('token', env.FINNHUB_API_KEY ?? '')

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
    headers: { accept: 'application/json' },
  })

  if (!res.ok) {
    logger.error('Finnhub news fetch failed', { status: res.status })
    throw new Error(`Finnhub news ${res.status}`)
  }

  const data = (await res.json()) as FinnhubNewsItem[]
  if (!Array.isArray(data)) {
    throw new Error('Finnhub news returned an unexpected shape')
  }

  return data
    .filter((a) => a && a.headline && a.url)
    .slice(0, MAX_ARTICLES)
    .map<NewsArticle>((a) => ({
      id: String(a.id),
      headline: a.headline,
      summary: a.summary ?? '',
      source: a.source ?? 'Unknown',
      url: a.url,
      imageUrl: a.image ? a.image : null,
      publishedAt: new Date((a.datetime ?? 0) * 1000).toISOString(),
    }))
}
