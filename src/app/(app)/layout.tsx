import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Topbar } from '@/components/layout/topbar'
import { headers } from 'next/headers'

/**
 * Protected app layout — server-side auth gate.
 * The middleware also guards routes, but this provides a fallback and
 * passes the current path to the Topbar for active state.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get current pathname for active nav state
  const headersList = headers()
  const pathname = headersList.get('x-invoke-path') ?? ''

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Topbar activePath={pathname} />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-8 md:px-6">{children}</main>
    </div>
  )
}
