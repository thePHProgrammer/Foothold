import { redirect } from 'next/navigation'
import { auth } from '@/auth'

/**
 * Root page — redirects based on auth state.
 * Authenticated users → /home
 * Unauthenticated → /login
 *
 * In Step 2 this becomes a marketing landing page with a hero section.
 */
export default async function RootPage() {
  const session = await auth()
  redirect(session?.user ? '/home' : '/login')
}
