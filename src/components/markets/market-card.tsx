import { Card } from '@/components/ui/card'
import { ChangePill } from '@/components/markets/change-pill'
import { Sparkline } from '@/components/markets/sparkline'
import { StatusBadge } from '@/components/markets/status-badge'
import { formatAsOf, formatPrice } from '@/lib/market/format'
import type { MarketPrice } from '@/server/services/market-data.service'

export function MarketCard({ price }: { price: MarketPrice }) {
  const unavailable = price.price === null
  const positive =
    price.change24hPct !== null
      ? price.change24hPct >= 0
      : ((price.sparkline &&
          price.sparkline.length >= 2 &&
          price.sparkline[price.sparkline.length - 1]! >= price.sparkline[0]!) ??
        true)

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-ink">{price.name}</h3>
          <p className="font-mono text-[11px] text-ink-faint">{price.symbol}</p>
        </div>
        <StatusBadge freshness={price.freshness} session={price.session} />
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="text-h3 font-extrabold text-ink">
          {unavailable ? 'Data unavailable' : formatPrice(price.price, price.kind, price.symbol)}
        </p>
        {price.change24hPct !== null && <ChangePill pct={price.change24hPct} />}
      </div>

      <Sparkline data={price.sparkline} positive={positive} />

      <p className="font-mono text-[10px] text-ink-faint">As of {formatAsOf(price.asOf)}</p>
    </Card>
  )
}
