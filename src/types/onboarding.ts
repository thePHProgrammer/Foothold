export type Experience = 'beginner' | 'intermediate' | 'advanced'
export type Market = 'crypto' | 'stocks' | 'forex'

export type OnboardingPreferences = {
  markets: Market[]
  experience: Experience
  dailyGoalMins: number
}
