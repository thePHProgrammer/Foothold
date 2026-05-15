import type { UserOnboardingPreferences } from '@prisma/client'

import { prisma } from '@/server/db'
import type { OnboardingPreferencesInput } from '@/lib/validations/onboarding'

export async function getOnboardingPreferences(
  userId: string
): Promise<UserOnboardingPreferences | null> {
  return prisma.userOnboardingPreferences.findUnique({ where: { userId } })
}

/**
 * Saves preferences AND flips User.onboardingCompleted in a single transaction.
 * Uses array form $transaction (NOT callback form) — required for Neon's
 * pooled PgBouncer transaction-mode connection. Do not "improve" this to the
 * callback form or live writes will fail in production.
 */
export async function saveOnboardingPreferences(
  userId: string,
  prefs: OnboardingPreferencesInput
): Promise<void> {
  const upsert = prisma.userOnboardingPreferences.upsert({
    where: { userId },
    create: {
      userId,
      markets: prefs.markets,
      experience: prefs.experience,
      dailyGoalMins: prefs.dailyGoalMins,
    },
    update: {
      markets: prefs.markets,
      experience: prefs.experience,
      dailyGoalMins: prefs.dailyGoalMins,
    },
  })

  const userUpdate = prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  })

  await prisma.$transaction([upsert, userUpdate])
}
