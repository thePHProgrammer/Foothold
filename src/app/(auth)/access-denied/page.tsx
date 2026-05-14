import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Access Denied' }

/** Shown when a user tries to access a route they don't have permission for (e.g. admin routes). */
export default function AccessDeniedPage() {
  return (
    <div
      className="w-full max-w-[460px] rounded-lg border border-line bg-surface p-8 text-center"
      style={{ boxShadow: 'var(--shadow-2)' }}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-danger-tint text-2xl">
        🔒
      </div>
      <h1 className="text-h3 text-ink">Access denied</h1>
      <p className="mt-2 text-sm text-ink-soft">
        You don&apos;t have permission to view this page.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/home"
          className="block rounded-sm bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          Back to home
        </Link>
        <Link
          href="/login"
          className="block rounded-sm border border-line-2 bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-alt"
        >
          Sign in with a different account
        </Link>
      </div>
    </div>
  )
}
