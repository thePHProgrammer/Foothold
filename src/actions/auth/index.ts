'use server'

import { signIn, signOut } from '@/auth'
import { logger } from '@/lib/logger'

/** Initiates Google OAuth sign-in flow. */
export async function signInWithGoogle(callbackUrl?: string) {
  await signIn('google', { redirectTo: callbackUrl ?? '/home' })
}

/** Signs the user out and redirects to /login. */
export async function handleSignOut() {
  logger.info('User signing out')
  await signOut({ redirectTo: '/login' })
}
