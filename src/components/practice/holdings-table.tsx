import { Card } from '@/components/ui/card'
import { formatPct } from '@/lib/market/format'
import { formatQty, formatSignedUsd, formatUsd } from '@/lib/paper-trading/format'
import type { PositionView } from '@/lib/paper-trading/portfolio'
import { cn } from '@/lib/utils'

function pnlColor(value: number): string {
  return value > 0 ? 'text-market-up' : value < 0 ? 'text-market-down' : 'text-market-neutral'
}

export function HoldingsTable({ positions }: { positions: PositionView[] }) {
  const open = positions.filter((p) => p.quantity > 0)

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-line px-5 py-3">
        <h2 className="text-sm font-bold text-ink">Your holdings (practice)</h2>
      </div>

      {open.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-ink-soft">
          No positions yet. Place your first practice trade to see holdings here.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {open.map((p) => (
            <li
              key={p.symbol}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-semibold text-ink">
                  {p.symbol}{' '}
                  <span className="font-sans text-[12px] font-normal text-ink-faint">{p.name}</span>
                </p>
                <p className="font-mono text-[11px] text-ink-faint">
                  {formatQty(p.quantity)} @ {formatUsd(p.avgCost)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-ink">
                  {formatUsd(p.marketValue)}
                </p>
                <p className="font-mono text-[11px] text-ink-faint">
                  {p.price === null ? 'stale price' : 'value'}
                </p>
              </div>
              <div
                className={cn(
                  'text-right font-mono text-sm font-semibold',
                  pnlColor(p.unrealizedPnl)
                )}
              >
                <p>{formatSignedUsd(p.unrealizedPnl)}</p>
                <p className="text-[11px]">{formatPct(p.unrealizedPnlPct)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
