import type { Metadata } from 'next'

import { PreferenceWizard } from '@/components/onboarding/preference-wizard'

export const metadata: Metadata = { title: 'Set up your plan — Foothold' }

export default function OnboardingPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="eyebrow mb-1">Welcome to Foothold</p>
        <h1 className="text-h1 text-ink">Set up your plan</h1>
        <p className="mt-2 text-sm text-ink-soft">
          A few quick questions and we&apos;ll point you at the right lessons.
        </p>
      </div>
      <PreferenceWizard />
    </div>
  )
}
