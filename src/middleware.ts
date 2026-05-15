import { auth } from '@/auth'
import { NextResponse } from 'next/server'

/**
 * Route protection middleware — runs on Vercel Edge Runtime.
 *
 * CRITICAL: Do NOT import Prisma here. The Edge Runtime does not support
 * Node.js APIs that Prisma requires. Auth uses JWT so no DB call is needed.
 *
 * Protected routes: anything under /(app)/ which maps to /home, /learn, etc.
 * Public routes: /login, /api/auth/*, / (landing), static assets.
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user

  const isAuthRoute =
    nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/access-denied')
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isPublicRoute =
    nextUrl.pathname === '/' ||
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.startsWith('/favicon')

  // Let the auth API handle itself
  if (isApiAuthRoute) return NextResponse.next()

  // Let public routes through
  if (isPublicRoute) return NextResponse.next()

  // Redirect authenticated users away from login
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/learn', nextUrl))
  }

  // Redirect unauthenticated users to login
  if (!isAuthRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl)
    // Preserve the attempted URL so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
