'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

/** Wraps the app in NextAuth's SessionProvider. Must be a Client Component. */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
