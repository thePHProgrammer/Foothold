import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { features } from '@/config/features'
import { formatQty, formatUsd } from '@/lib/paper-trading/format'
import type { TradeRow } from '@/server/services/paper-trading.service'
import { cn } from '@/lib/utils'

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function RecentTrades({ trades }: { trades: TradeRow[] }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="border-b border-line px-5 py-3">
        <h2 className="text-sm font-bold text-ink">Recent activity</h2>
      </div>

      {trades.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-ink-soft">No trades yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {trades.map((t) => (
            <li key={t.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3">
              <span
                className={cn(
                  'inline-flex h-6 items-center rounded-pill border px-2.5 text-[11px] font-bold uppercase',
                  t.side === 'buy'
                    ? 'border-success/30 bg-success-tint text-success'
                    : 'border-danger/30 bg-danger-tint text-danger'
                )}
              >
                {t.side}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-ink">
                  {formatQty(t.quantity)} {t.symbol}
                </p>
                <p className="font-mono text-[11px] text-ink-faint">
                  @ {formatUsd(t.price)} · {timeFmt.format(t.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-ink">{formatUsd(t.total)}</p>
                {features.journal && (
                  <Link
                    href={`/journal?tradeId=${t.id}`}
                    className="font-mono text-[11px] font-semibold text-brand no-underline hover:underline"
                  >
                    Journal →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
