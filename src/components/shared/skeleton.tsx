import { cn } from '@/lib/utils'

/** Animated skeleton placeholder — use while data is loading. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-sm bg-gradient-to-r from-paper-alt via-line to-paper-alt bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  )
}
