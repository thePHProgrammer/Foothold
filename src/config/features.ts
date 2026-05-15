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

  /** Step 3: Ollama-powered AI trading assistant */
  chatbot: false,

  /** Step 4: Live market prices (crypto, stocks, forex) */
  liveMarket: false,

  /** Step 5: Paper trading simulator */
  paperTrading: false,

  /** Step 6: Interactive quizzes */
  quizzes: false,

  /** Step 7: Trading journal */
  journal: false,

  /** Step 8: Watchlists */
  watchlists: false,

  /** Step 9: News feed */
  newsFeed: false,

  /** Step 10: Admin CMS */
  adminCms: false,

  /** Dark mode (CSS only — always enabled, user-toggled) */
  darkMode: true,
} as const

export type FeatureFlag = keyof typeof features
