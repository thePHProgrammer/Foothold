import { cn } from '@/lib/utils'

export interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  className?: string
  trackClassName?: string
  fillClassName?: string
  showLabel?: boolean
}

export function ProgressRing({
  value,
  size = 44,
  stroke = 4,
  className,
  trackClassName = 'stroke-paper-alt',
  fillClassName = 'stroke-brand',
  showLabel = true,
}: ProgressRingProps) {
  const pct = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div
      role="img"
      aria-label={`${Math.round(pct)}% complete`}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn(fillClassName, 'transition-all duration-300')}
        />
      </svg>
      {showLabel && (
        <span className="absolute font-mono text-[10px] font-semibold text-ink-soft">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
