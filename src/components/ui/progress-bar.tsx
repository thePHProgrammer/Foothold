import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  indicatorClassName?: string
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100))
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('h-2 w-full overflow-hidden rounded-pill bg-paper-alt', className)}
        {...props}
      >
        <div
          className={cn(
            'h-full rounded-pill bg-brand transition-[width] duration-300',
            indicatorClassName
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
