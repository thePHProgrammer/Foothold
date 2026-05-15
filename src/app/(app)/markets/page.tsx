import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MarketDisclaimer } from '@/components/markets/market-disclaimer'
import { MarketSection } from '@/components/markets/market-section'
import { features } from '@/config/features'
import { formatAsOf } from '@/lib/market/format'
import { getAllMarketPrices } from '@/server/services/market-data.service'

export const metadata: Metadata = { title: 'Markets — Foothold' }

export const revalidate = 60

export default async function MarketsPage() {
  if (!features.liveMarket) notFound()

  const prices = await getAllMarketPrices()
  const crypto = prices.filter((p) => p.kind === 'crypto')
  const stocks = prices.filter((p) => p.kind === 'stock')
  const forex = prices.filter((p) => p.kind === 'forex')

  const newestAsOf = prices.reduce<string>((latest, p) => (p.asOf > latest ? p.asOf : latest), '')

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Markets</p>
        <h1 className="text-h1 text-ink">Live prices</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Refreshed every 60 seconds. Use this as context for the lessons — never as a trade signal.
        </p>
      </div>

      <MarketSection title="Crypto" emoji="🪙" prices={crypto} />
      <MarketSection title="Stocks" emoji="📈" prices={stocks} />
      <MarketSection title="Forex" emoji="💱" prices={forex} />

      {newestAsOf && (
        <p className="text-center font-mono text-[11px] text-ink-faint">
          Last update {formatAsOf(newestAsOf)}
        </p>
      )}

      <MarketDisclaimer />
    </div>
  )
}
