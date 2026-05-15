import { MarketCard } from '@/components/markets/market-card'
import type { MarketPrice } from '@/server/services/market-data.service'

export function MarketSection({
  title,
  emoji,
  prices,
}: {
  title: string
  emoji: string
  prices: MarketPrice[]
}) {
  if (prices.length === 0) return null
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-h3 text-ink">
          <span aria-hidden className="mr-1">
            {emoji}
          </span>
          {title}
        </h2>
        <span className="font-mono text-[11px] text-ink-faint">{prices.length} instruments</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {prices.map((p) => (
          <MarketCard key={p.symbol} price={p} />
        ))}
      </div>
    </section>
  )
}
