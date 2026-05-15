'use server'

import { redirect } from 'next/navigation'

import { unstable_update } from '@/auth'
import { onboardingPreferencesSchema } from '@/lib/validations/onboarding'
import { logger } from '@/lib/logger'
import { requireAuth } from '@/server/auth'
import * as onboardingRepo from '@/server/repositories/onboarding.repository'

export async function saveOnboardingPreferences(formData: unknown) {
  const session = await requireAuth()
  const prefs = onboardingPreferencesSchema.parse(formData)

  await onboardingRepo.saveOnboardingPreferences(session.user.id, prefs)

  // Best-effort JWT refresh so middleware/edge reads see the new flag immediately.
  // The DB is the source of truth; if this throws, the layout-level gate still
  // works correctly on the next request.
  try {
    await unstable_update({ user: { onboardingCompleted: true } })
  } catch (error) {
    logger.warn('unstable_update failed after onboarding', { error, userId: session.user.id })
  }

  logger.info('Onboarding preferences saved', { userId: session.user.id })
  redirect('/learn')
}
