import { MarketCard } from '@/components/markets/market-card'
import { getSymbolsForTopic, type Topic } from '@/lib/market/symbols'
import { getPricesFor } from '@/server/services/market-data.service'

const TOPIC_LABEL: Record<Topic, string> = {
  crypto: 'Live crypto market',
  stocks: 'Live stock market',
  forex: 'Live forex market',
}

export async function RelatedMarketStrip({ topic }: { topic: Topic }) {
  const symbols = getSymbolsForTopic(topic, 3).map((s) => s.symbol)
  if (symbols.length === 0) return null

  const prices = await getPricesFor(symbols).catch(() => [])
  const visible = prices.filter((p) => p.price !== null)
  if (visible.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-h4 text-ink">{TOPIC_LABEL[topic]}</h2>
        <p className="text-xs text-ink-soft">Live context for what you just read</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <MarketCard key={p.symbol} price={p} />
        ))}
      </div>
    </section>
  )
}
