import { cn } from '@/lib/utils'

interface SparklineProps {
  data?: number[]
  positive?: boolean
  className?: string
}

export function Sparkline({ data, positive = true, className }: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <svg
        viewBox="0 0 100 30"
        role="img"
        aria-label="No data available"
        className={cn('h-7 w-full text-ink-faint', className)}
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="15"
          x2="100"
          y2="15"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      </svg>
    )
  }

  const { min, max } = data.reduce(
    (acc, v) => ({ min: Math.min(acc.min, v), max: Math.max(acc.max, v) }),
    { min: Infinity, max: -Infinity }
  )
  const range = max - min === 0 ? 1 : max - min
  const n = data.length

  let d = ''
  for (let i = 0; i < n; i += 1) {
    const v = data[i]
    if (typeof v !== 'number') continue
    const x = (i / (n - 1)) * 100
    const y = 28 - ((v - min) / range) * 26
    d += i === 0 ? `M${x.toFixed(2)} ${y.toFixed(2)}` : ` L${x.toFixed(2)} ${y.toFixed(2)}`
  }

  return (
    <svg
      viewBox="0 0 100 30"
      role="img"
      aria-label="Price sparkline"
      className={cn('h-7 w-full', positive ? 'text-market-up' : 'text-market-down', className)}
      preserveAspectRatio="none"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
