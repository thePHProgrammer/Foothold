import type { ReactNode } from 'react'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MarketDisclaimer } from '@/components/markets/market-disclaimer'
import { MarketSection } from '@/components/markets/market-section'
import { WatchlistStarButton } from '@/components/watchlist/watchlist-star-button'
import { features } from '@/config/features'
import { formatAsOf } from '@/lib/market/format'
import { getCurrentUser } from '@/server/auth'
import { getAllMarketPrices } from '@/server/services/market-data.service'
import { getWatchedSymbols } from '@/server/services/watchlist.service'

export const metadata: Metadata = { title: 'Markets — Foothold' }

export const revalidate = 60

export default async function MarketsPage() {
  if (!features.liveMarket) notFound()

  const prices = await getAllMarketPrices()
  const crypto = prices.filter((p) => p.kind === 'crypto')
  const stocks = prices.filter((p) => p.kind === 'stock')
  const forex = prices.filter((p) => p.kind === 'forex')

  const newestAsOf = prices.reduce<string>((latest, p) => (p.asOf > latest ? p.asOf : latest), '')

  // Additive: render a watchlist star per card when the feature is on.
  let renderAction: ((symbol: string) => ReactNode) | undefined
  if (features.watchlists) {
    const user = await getCurrentUser()
    if (user) {
      const watched = new Set(await getWatchedSymbols(user.id))
      renderAction = (symbol) => (
        <WatchlistStarButton symbol={symbol} watched={watched.has(symbol)} />
      )
    }
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Markets</p>
        <h1 className="text-h1 text-ink">Live prices</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Refreshed every 60 seconds. Use this as context for the lessons — never as a trade signal.
        </p>
      </div>

      <MarketSection title="Crypto" emoji="🪙" prices={crypto} renderAction={renderAction} />
      <MarketSection title="Stocks" emoji="📈" prices={stocks} renderAction={renderAction} />
      <MarketSection title="Forex" emoji="💱" prices={forex} renderAction={renderAction} />

      {newestAsOf && (
        <p className="text-center font-mono text-[11px] text-ink-faint">
          Last update {formatAsOf(newestAsOf)}
        </p>
      )}

      <MarketDisclaimer />
    </div>
  )
}
