'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logger.error('Unhandled client error', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-danger-tint text-2xl">
        ⚠️
      </div>
      <div>
        <h1 className="text-h3 text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-soft">
          An unexpected error occurred. If this keeps happening, please refresh the page.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-ink-faint">Error ID: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="rounded-sm bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
      >
        Try again
      </button>
    </div>
  )
}
