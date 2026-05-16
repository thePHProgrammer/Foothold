'use client'

import { useMemo, useState, useTransition } from 'react'

import { placePaperOrder } from '@/actions/paper-trading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/market/format'
import { FEE_RATE, QUICK_AMOUNTS } from '@/lib/paper-trading/constants'
import { formatQty, formatUsd } from '@/lib/paper-trading/format'
import { calculateOrderPreview, type OrderSide } from '@/lib/paper-trading/portfolio'
import type { Kind } from '@/lib/market/symbols'
import { cn } from '@/lib/utils'

export function OrderTicket({
  symbol,
  name,
  kind,
  price,
  cashBalance,
  positionQty,
}: {
  symbol: string
  name: string
  kind: Kind
  price: number | null
  cashBalance: number
  positionQty: number
}) {
  const [side, setSide] = useState<OrderSide>('buy')
  const [notional, setNotional] = useState<number>(QUICK_AMOUNTS[1])
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const tradable = price !== null && price > 0

  const preview = useMemo(
    () => calculateOrderPreview({ side, notional: notional || 0, price: tradable ? price : 0 }),
    [side, notional, price, tradable]
  )

  function setAll() {
    if (!tradable) return
    if (side === 'buy') {
      setNotional(Math.floor((cashBalance / (1 + FEE_RATE)) * 100) / 100)
    } else {
      setNotional(Math.floor(positionQty * price * 100) / 100)
    }
  }

  function submit() {
    setError(null)
    setDone(null)
    startTransition(async () => {
      const result = await placePaperOrder({ symbol, side, notional })
      if (result.ok) {
        setDone(`${side === 'buy' ? 'Bought' : 'Sold'} ${symbol} (practice)`)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="grid grid-cols-2">
        {(['buy', 'sell'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSide(s)
              setError(null)
              setDone(null)
            }}
            className={cn(
              'py-3 text-sm font-bold capitalize transition-colors',
              side === s
                ? s === 'buy'
                  ? 'bg-success-tint text-success'
                  : 'bg-danger-tint text-danger'
                : 'bg-paper-alt text-ink-soft hover:text-ink'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-ink">{name}</p>
            <p className="font-mono text-[11px] text-ink-faint">{symbol}</p>
          </div>
          <p className="font-mono text-sm font-semibold text-ink">
            {formatPrice(price, kind, symbol)}
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="inline-flex h-6 items-center rounded-pill border border-line-2 bg-paper-alt px-2.5 text-[11px] font-semibold text-ink-soft">
            Market order
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notional">
            {side === 'buy' ? 'Amount to spend' : 'Amount to sell'} (USD)
          </Label>
          <div className="flex items-center gap-2 rounded-sm border border-line-2 bg-surface px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-1">
            <span className="text-ink-faint">$</span>
            <input
              id="notional"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={Number.isNaN(notional) ? '' : notional}
              onChange={(e) => setNotional(Number(e.target.value))}
              className="h-10 w-full bg-transparent font-mono text-sm text-ink outline-none"
            />
            <span className="font-mono text-[11px] text-ink-faint">USD</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setNotional(a)}
              className={cn(
                'rounded-pill border px-3 py-1.5 font-mono text-xs font-semibold transition-colors',
                notional === a
                  ? 'border-brand bg-brand text-white'
                  : 'border-line-2 bg-surface text-ink-soft hover:bg-paper-alt'
              )}
            >
              ${a}
            </button>
          ))}
          <button
            type="button"
            onClick={setAll}
            className="rounded-pill border border-line-2 bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-soft transition-colors hover:bg-paper-alt"
          >
            All
          </button>
        </div>

        <div className="space-y-1.5 rounded-sm bg-paper-alt p-3 text-[13px]">
          <div className="flex justify-between">
            <span className="text-ink-soft">{side === 'buy' ? "You'll get" : "You'll sell"}</span>
            <span className="font-mono font-semibold text-ink">
              ≈ {formatQty(preview.quantity)} {symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Fee (practice)</span>
            <span className="font-mono font-semibold text-ink">{formatUsd(preview.fee)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-1.5">
            <span className="font-semibold text-ink">
              {side === 'buy' ? 'Total cost' : 'Net proceeds'}
            </span>
            <span className="font-mono font-bold text-ink">{formatUsd(preview.total)}</span>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}
        {done && <p className="text-sm font-medium text-success">{done}</p>}

        <Button
          variant={side === 'buy' ? 'success' : 'danger'}
          size="xl"
          onClick={submit}
          disabled={isPending || !tradable || !notional || notional <= 0}
          className="w-full"
        >
          {!tradable
            ? 'Price unavailable'
            : isPending
              ? 'Placing…'
              : `${side === 'buy' ? 'Buy' : 'Sell'} ${name}`}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-faint">
          <span aria-hidden>🔒</span>
          Practice money only — no real money will be spent
        </p>
      </div>
    </Card>
  )
}
