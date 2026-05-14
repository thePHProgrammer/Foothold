'use server'

import { requireAuth } from '@/server/auth'
import { prisma } from '@/server/db'
import { logger } from '@/lib/logger'

/** Marks onboarding as completed for the current user. */
export async function completeOnboarding() {
  const session = await requireAuth()

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingCompleted: true },
  })

  logger.info('Onboarding completed', { userId: session.user.id })
}

/** Updates the current user's display name. */
export async function updateUserName(name: string) {
  const session = await requireAuth()

  if (!name.trim() || name.length > 60) {
    throw new Error('Name must be 1–60 characters')
  }

  return prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
    select: { id: true, name: true },
  })
}
