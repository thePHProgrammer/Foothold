import { formatPct } from '@/lib/market/format'
import { cn } from '@/lib/utils'

export function ChangePill({
  pct,
  size = 'md',
  className,
}: {
  pct: number | null
  size?: 'sm' | 'md'
  className?: string
}) {
  const positive = pct !== null && pct > 0
  const negative = pct !== null && pct < 0
  const arrow = positive ? '↑' : negative ? '↓' : '·'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-pill border font-mono font-semibold',
        size === 'sm' ? 'h-5 px-1.5 text-[10px]' : 'h-6 px-2 text-[11px]',
        positive && 'border-market-up/30 bg-market-up/10 text-market-up',
        negative && 'border-market-down/30 bg-market-down/10 text-market-down',
        !positive && !negative && 'border-line-2 bg-paper-alt text-market-neutral',
        className
      )}
    >
      <span aria-hidden>{arrow}</span>
      {formatPct(pct)}
    </span>
  )
}
