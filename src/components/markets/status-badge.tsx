import { cn } from '@/lib/utils'
import type { MarketSession } from '@/lib/market/symbols'
import type { QuoteFreshness } from '@/server/services/market-data.service'

const FRESHNESS_STYLES: Record<QuoteFreshness, string> = {
  live: 'border-success/30 bg-success-tint text-success',
  delayed: 'border-warn/30 bg-warn-tint text-warn',
  stale: 'border-danger/30 bg-danger-tint text-danger',
}

const FRESHNESS_LABEL: Record<QuoteFreshness, string> = {
  live: 'Live',
  delayed: 'Delayed',
  stale: 'Stale',
}

const SESSION_DOT: Record<MarketSession, string> = {
  open: 'bg-market-up',
  closed: 'bg-market-neutral',
  weekend: 'bg-market-neutral opacity-60',
}

const SESSION_LABEL: Record<MarketSession, string> = {
  open: 'Market open',
  closed: 'Market closed',
  weekend: 'Weekend',
}

export function StatusBadge({
  freshness,
  session,
  className,
}: {
  freshness: QuoteFreshness
  session: MarketSession
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'inline-flex h-5 items-center rounded-pill border px-1.5 text-[9px] font-bold uppercase tracking-wider',
          FRESHNESS_STYLES[freshness]
        )}
      >
        {FRESHNESS_LABEL[freshness]}
      </span>
      <span
        className={cn('inline-block h-2 w-2 rounded-full', SESSION_DOT[session])}
        title={SESSION_LABEL[session]}
        aria-label={SESSION_LABEL[session]}
      />
    </span>
  )
}
