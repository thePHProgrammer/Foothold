import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { Topbar } from '@/components/layout/topbar'
import { MarketTicker } from '@/components/markets/market-ticker'
import { features } from '@/config/features'
import { getCurrentUser } from '@/server/auth'

/**
 * Protected app layout — server-side auth gate AND onboarding gate.
 * Edge middleware can't query Prisma, so the DB-backed onboarding check
 * happens here. The DB (not the JWT) is the source of truth.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.onboardingCompleted) {
    redirect('/onboarding')
  }

  const headersList = headers()
  const pathname = headersList.get('x-invoke-path') ?? ''

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-50">
        <Topbar activePath={pathname} />
        {features.liveMarket && (
          <Suspense fallback={null}>
            <MarketTicker />
          </Suspense>
        )}
      </header>
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-8 md:px-6">{children}</main>
    </div>
  )
}
