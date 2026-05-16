'use client'

import { useState, useTransition } from 'react'

import { addToWatchlist } from '@/actions/watchlist'
import { Button } from '@/components/ui/button'
import { messageForWatchlistError } from '@/lib/watchlist/constants'

export function AddSymbolPicker({ available }: { available: { symbol: string; name: string }[] }) {
  const [symbol, setSymbol] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (available.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        You&apos;re watching every instrument in the catalog. 🎉
      </p>
    )
  }

  function add() {
    if (!symbol) return
    setError(null)
    startTransition(async () => {
      const res = await addToWatchlist({ symbol })
      if (res.ok) setSymbol('')
      else setError(messageForWatchlistError(res.code))
    })
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <select
          aria-label="Add a symbol to your watchlist"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="h-10 w-full max-w-xs rounded-sm border border-line-2 bg-surface px-3 text-sm text-ink focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
        >
          <option value="">Add a symbol…</option>
          {available.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol} — {s.name}
            </option>
          ))}
        </select>
        <Button variant="primary" onClick={add} disabled={!symbol || isPending}>
          {isPending ? 'Adding…' : 'Add'}
        </Button>
      </div>
      {error && <p className="text-sm font-medium text-danger">{error}</p>}
    </div>
  )
}
