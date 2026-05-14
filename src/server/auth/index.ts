import { auth } from '@/auth'
import { prisma } from '@/server/db'
import { logger } from '@/lib/logger'

/** Returns the current session or null. Use in Server Components and Server Actions. */
export async function getCurrentSession() {
  return auth()
}

/** Returns the current user from the DB, or null if not authenticated. */
export async function getCurrentUser() {
  const session = await getCurrentSession()
  if (!session?.user?.id) return null

  try {
    return await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    })
  } catch (error) {
    logger.error('Failed to fetch current user', { error, userId: session.user.id })
    return null
  }
}

/** Returns true if the current user has the given role. */
export async function hasRole(role: string): Promise<boolean> {
  const session = await getCurrentSession()
  return session?.user?.role === role
}

/** Throws if not authenticated. Use in Server Actions that require auth. */
export async function requireAuth() {
  const session = await getCurrentSession()
  if (!session?.user) {
    throw new Error('Unauthorised')
  }
  return session
}
