import { MarketCard } from '@/components/markets/market-card'
import { WatchlistStarButton } from '@/components/watchlist/watchlist-star-button'
import type { MarketPrice } from '@/server/services/market-data.service'

/** Watched instruments — reuses MarketCard via its additive `action` slot. */
export function WatchlistGrid({ prices }: { prices: MarketPrice[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {prices.map((p) => (
        <MarketCard
          key={p.symbol}
          price={p}
          action={<WatchlistStarButton symbol={p.symbol} watched />}
        />
      ))}
    </div>
  )
}
