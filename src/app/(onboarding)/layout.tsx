import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/server/auth'

/**
 * Onboarding layout — auth-required AND reverse-gated.
 * If the user has already completed onboarding (DB check), they get
 * bounced to /learn so they can't revisit the wizard. The DB is the
 * source of truth — we deliberately ignore the JWT here.
 */
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.onboardingCompleted) {
    redirect('/learn')
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-5 py-8 md:px-6">{children}</main>
    </div>
  )
}
