import { redirect } from 'next/navigation'
import { auth } from '@/auth'

/**
 * Root page — redirects based on auth state.
 * Authenticated users → /learn (gated by (app)/layout to /onboarding if needed).
 * Unauthenticated → /login
 */
export default async function RootPage() {
  const session = await auth()
  redirect(session?.user ? '/learn' : '/login')
}
