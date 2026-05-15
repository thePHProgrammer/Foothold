import { ChangePill } from '@/components/markets/change-pill'
import { formatPrice } from '@/lib/market/format'
import { HERO_SYMBOLS } from '@/lib/market/symbols'
import { getPricesFor } from '@/server/services/market-data.service'

export async function MarketPills() {
  const prices = await getPricesFor(HERO_SYMBOLS).catch(() => [])
  if (prices.length === 0) return null

  const visible = prices.filter((p) => p.price !== null)
  if (visible.length === 0) return null

  return (
    <>
      {visible.map((p) => (
        <span
          key={p.symbol}
          className="inline-flex h-7 items-center gap-1.5 rounded-pill border border-line-2 bg-surface px-3 text-[12px] font-semibold text-ink"
        >
          <span className="font-mono text-ink-soft">{p.symbol}</span>
          <span>{formatPrice(p.price, p.kind, p.symbol)}</span>
          {p.change24hPct !== null && <ChangePill pct={p.change24hPct} size="sm" />}
        </span>
      ))}
    </>
  )
}
