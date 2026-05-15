import { formatPrice } from '@/lib/market/format'
import { TICKER_SYMBOLS } from '@/lib/market/symbols'
import { getPricesFor, type MarketPrice } from '@/server/services/market-data.service'
import { cn } from '@/lib/utils'

export async function MarketTicker() {
  const prices = await getPricesFor(TICKER_SYMBOLS).catch(() => [] as MarketPrice[])
  const visible = prices.filter((p) => p.price !== null)
  if (visible.length === 0) return null

  return (
    <div className="border-b border-line bg-paper-alt/80 backdrop-blur">
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max will-change-transform">
          <TickerList prices={visible} />
          <TickerList prices={visible} ariaHidden />
        </div>
      </div>
    </div>
  )
}

function TickerList({ prices, ariaHidden }: { prices: MarketPrice[]; ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-5 px-5 py-1.5 text-[11px] font-medium text-ink"
      aria-hidden={ariaHidden}
    >
      {prices.map((p, i) => {
        const positive = p.change24hPct !== null && p.change24hPct > 0
        const negative = p.change24hPct !== null && p.change24hPct < 0
        return (
          <li key={`${p.symbol}-${i}`} className="flex shrink-0 items-center gap-1.5">
            <span className="font-mono text-ink-soft">{p.symbol}</span>
            <span>{formatPrice(p.price, p.kind, p.symbol)}</span>
            {p.change24hPct !== null && (
              <span
                className={cn(
                  'font-mono',
                  positive && 'text-market-up',
                  negative && 'text-market-down',
                  !positive && !negative && 'text-market-neutral'
                )}
              >
                {positive ? '↑' : negative ? '↓' : '·'}
                {Math.abs(p.change24hPct).toFixed(2)}%
              </span>
            )}
            <span aria-hidden className="ml-3 text-ink-faint">
              ·
            </span>
          </li>
        )
      })}
    </ul>
  )
}
