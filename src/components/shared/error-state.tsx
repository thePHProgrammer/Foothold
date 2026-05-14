import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  description?: string
  retry?: () => void
  className?: string
}

/** Inline error display — use inside sections (not full-page errors). */
export function ErrorState({
  title = 'Failed to load',
  description = 'Something went wrong. Please try again.',
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-md border border-danger-tint bg-danger-tint/50 py-8 text-center',
        className
      )}
    >
      <div className="text-2xl">⚠️</div>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
      </div>
      {retry && (
        <Button variant="secondary" size="sm" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  )
}
