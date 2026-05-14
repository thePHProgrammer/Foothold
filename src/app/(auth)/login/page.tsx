import type { Metadata } from 'next'
import { signInWithGoogle } from '@/actions/auth'
import { GoogleIcon } from '@/components/icons/google'
import { BrandMark } from '@/components/layout/brand-mark'

export const metadata: Metadata = {
  title: 'Sign in — Foothold',
  description: 'Sign in to Foothold to start learning to trade.',
}

/**
 * Login page — matches the 01-Login.html design mockup.
 * Uses Server Actions for form submission (no client-side JS needed for auth).
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string }
}) {
  const callbackUrl = searchParams.callbackUrl ?? '/home'
  const hasError = !!searchParams.error

  return (
    <div
      className="w-full max-w-[460px] rounded-lg border border-line bg-surface p-8"
      style={{ boxShadow: 'var(--shadow-2)' }}
    >
      {/* Brand */}
      <div className="mb-6 flex flex-col items-center gap-2.5 text-center">
        <BrandMark size="lg" />
        <h1 className="text-[28px] font-extrabold tracking-tight text-ink">Foothold</h1>
        <p className="text-sm text-ink-soft">Learn to trade — one step at a time.</p>
      </div>

      {/* Error banner */}
      {hasError && (
        <div className="mb-4 rounded-sm border border-danger-tint bg-danger-tint px-4 py-3 text-sm text-danger">
          Sign-in failed. Please try again.
        </div>
      )}

      {/* Sign-in choices */}
      <div className="flex flex-col gap-3">
        {/* Primary — Google */}
        <form
          action={async () => {
            'use server'
            await signInWithGoogle(callbackUrl)
          }}
        >
          <button
            type="submit"
            className="group flex w-full items-center gap-4 rounded-md border-[1.5px] border-brand bg-brand px-5 py-[18px] text-left text-white transition-all hover:bg-brand-strong active:scale-[0.99]"
            style={{ boxShadow: 'var(--shadow-1)' }}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
              <GoogleIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-[17px] font-bold leading-tight">Continue with Google</div>
              <div className="mt-0.5 text-[13px] opacity-80">Free · no credit card needed</div>
            </div>
            <svg
              className="h-5 w-5 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-center justify-center">
        <div className="inline-flex items-center gap-1.5 rounded-pill bg-paper-alt px-3 py-1.5 text-[11px] text-ink-faint">
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Bank-grade security · Practice money only
        </div>
      </div>

      {/* Legal */}
      <p className="mt-4 text-center text-[11px] text-ink-faint">
        By continuing you agree to our{' '}
        <a href="/terms" className="underline hover:text-ink-soft">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-ink-soft">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
