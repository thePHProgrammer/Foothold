/**
 * Feature flags — controls which features are active.
 *
 * Keep all flags false until the feature is fully implemented and tested.
 * Flip to true per-step as we build the platform.
 *
 * In the future these can be sourced from an env variable or a remote
 * config service (e.g. LaunchDarkly, Vercel Edge Config) for zero-deploy toggles.
 */
export const features = {
  /** Step 2: Lesson modules and learning hub */
  lessons: true,

  /** Step 3: Live market prices (crypto, stocks, forex) */
  liveMarket: true,

  /** Step 4: Paper trading simulator */
  paperTrading: true,

  /** Step 5: Interactive quizzes */
  quizzes: true,

  /** Step 6: Trading journal */
  journal: false,

  /** Step 7: Watchlists */
  watchlists: false,

  /** Step 8: News feed */
  newsFeed: false,

  /** Step 9: Admin CMS */
  adminCms: false,

  /** Dark mode (CSS only — always enabled, user-toggled) */
  darkMode: true,
} as const

export type FeatureFlag = keyof typeof features
