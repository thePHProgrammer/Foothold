import { z } from 'zod'

export const marketEnum = z.enum(['crypto', 'stocks', 'forex'])
export const experienceEnum = z.enum(['beginner', 'intermediate', 'advanced'])

export const onboardingPreferencesSchema = z.object({
  markets: z.array(marketEnum).min(1, 'Pick at least one market'),
  experience: experienceEnum,
  dailyGoalMins: z.number().int().min(5).max(120),
})

export type OnboardingPreferencesInput = z.infer<typeof onboardingPreferencesSchema>
