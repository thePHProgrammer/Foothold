'use client'

import { useState, useTransition } from 'react'

import { addToWatchlist, removeFromWatchlist } from '@/actions/watchlist'
import { messageForWatchlistError } from '@/lib/watchlist/constants'
import { cn } from '@/lib/utils'

/**
 * Star toggle reused on `/markets` cards and the `/watchlists` grid.
 * Errors (e.g. limit reached) surface via the accessible title + a polite
 * live region; the calmest fit for a tight icon control.
 */
export function WatchlistStarButton({
  symbol,
  watched,
  className,
}: {
  symbol: string
  watched: boolean
  className?: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    setError(null)
    startTransition(async () => {
      const res = watched ? await removeFromWatchlist({ symbol }) : await addToWatchlist({ symbol })
      if (!res.ok) setError(messageForWatchlistError(res.code))
    })
  }

  const label = error
    ? error
    : watched
      ? `Remove ${symbol} from watchlist`
      : `Add ${symbol} to watchlist`

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm transition-colors',
        watched
          ? 'border-brand/40 bg-brand-tint text-brand'
          : 'border-line-2 bg-surface text-ink-faint hover:bg-paper-alt hover:text-ink',
        error && 'border-danger/50 text-danger',
        'disabled:opacity-50',
        className
      )}
    >
      <span aria-hidden>{watched ? '★' : '☆'}</span>
      <span role="status" className="sr-only">
        {error ?? ''}
      </span>
    </button>
  )
}
