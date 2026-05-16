'use client'

import { useState, useTransition } from 'react'

import { resetPaperPortfolio } from '@/actions/paper-trading'
import { Button } from '@/components/ui/button'
import { formatPct } from '@/lib/market/format'
import { formatSignedUsd, formatUsd } from '@/lib/paper-trading/format'
import { cn } from '@/lib/utils'

export function PracticeHeader({
  totalValue,
  totalPnl,
  totalPnlPct,
}: {
  totalValue: number
  totalPnl: number
  totalPnlPct: number
}) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  const pnlColor =
    totalPnl > 0 ? 'text-market-up' : totalPnl < 0 ? 'text-market-down' : 'text-market-neutral'

  function reset() {
    startTransition(async () => {
      await resetPaperPortfolio()
      setConfirming(false)
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow mb-1">Practice trade</p>
        <h1 className="text-h1 text-ink">Trade with play money</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Prices are real and refresh every 60s. Trades are simulated — never real money.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
            Portfolio value
          </p>
          <p className="font-mono text-h3 font-extrabold text-ink">{formatUsd(totalValue)}</p>
          <p className={cn('font-mono text-[12px] font-semibold', pnlColor)}>
            {formatSignedUsd(totalPnl)} ({formatPct(totalPnlPct)})
          </p>
        </div>

        {confirming ? (
          <div className="flex flex-col gap-1.5">
            <Button variant="danger" size="sm" onClick={reset} disabled={isPending}>
              {isPending ? 'Resetting…' : 'Confirm reset'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
            ↻ Reset
          </Button>
        )}
      </div>
    </div>
  )
}
