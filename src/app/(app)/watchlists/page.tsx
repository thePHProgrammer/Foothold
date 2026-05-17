import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { EmptyState } from '@/components/shared/empty-state'
import { AddSymbolPicker } from '@/components/watchlist/add-symbol-picker'
import { NewsFeed } from '@/components/watchlist/news-feed'
import { WatchlistGrid } from '@/components/watchlist/watchlist-grid'
import { features } from '@/config/features'
import { SYMBOLS } from '@/lib/market/symbols'
import { getCurrentUser } from '@/server/auth'
import { getWatchlistScreenData } from '@/server/services/watchlist.service'

export const metadata: Metadata = { title: 'Watchlist — Foothold' }

export default async function WatchlistsPage() {
  if (!features.watchlists) notFound()

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { prices, news, newsAvailable } = await getWatchlistScreenData(user.id)

  const watched = new Set(prices.map((p) => p.symbol))
  const available = SYMBOLS.filter((s) => !watched.has(s.symbol)).map((s) => ({
    symbol: s.symbol,
    name: s.name,
  }))

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Watchlist</p>
        <h1 className="text-h1 text-ink">Symbols you&apos;re watching</h1>
        <p className="mt-2 text-sm text-ink-soft">
          A focused shortlist with live context. Star instruments here or from Markets — never a
          trade signal.
        </p>
      </div>

      <AddSymbolPicker available={available} />

      {prices.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="Your watchlist is empty"
          description="Add a symbol above, or tap the star on any card in Markets."
        />
      ) : (
        <WatchlistGrid prices={prices} />
      )}

      {features.newsFeed && <NewsFeed news={news} available={newsAvailable} />}
    </div>
  )
}
