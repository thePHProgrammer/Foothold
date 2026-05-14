import type { DefaultSession } from 'next-auth'

/**
 * Augment the default NextAuth Session type to include
 * custom fields (id, role, onboardingCompleted).
 *
 * These fields are injected in the `session` callback in src/auth.ts
 * and populated from the JWT token (which sources them from the DB).
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      onboardingCompleted: boolean
    } & DefaultSession['user']
  }

  interface User {
    role?: string
    onboardingCompleted?: boolean
  }
}

// JWT type augmentation — next-auth v5 beta uses the main module
// The JWT interface is augmented via the 'next-auth' module in v5
declare module 'next-auth' {
  interface JWT {
    id: string
    role: string
    onboardingCompleted: boolean
  }
}
