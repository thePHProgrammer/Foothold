import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

// Ensure types are augmented
import '@/types/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          // Request offline access for refresh token
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],

  // JWT strategy — edge-compatible; no DB query per request.
  // The middleware reads this token without touching the database.
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/onboarding', // redirect new users to onboarding (Step 2)
  },

  callbacks: {
    /**
     * signIn — gate who can sign in.
     * Currently allows any verified Google account.
     * Uncomment the domain check to restrict to an org email.
     */
    async signIn({ profile, account }) {
      if (account?.provider !== 'google') return false
      if (!profile?.email) return false

      // Optional: restrict to a specific domain
      // if (!profile.email.endsWith('@yourdomain.com')) return false

      logger.info('User signed in', { email: profile.email, provider: account.provider })
      return true
    },

    /**
     * jwt — called when token is created/refreshed.
     * Attach DB-sourced fields (role, onboardingCompleted) on first sign-in.
     * These come from `user` (populated by the Prisma adapter) — not from the client.
     */
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: user object is populated from DB via adapter
        token.id = user.id
        token.role = user.role ?? 'user'
        token.onboardingCompleted = user.onboardingCompleted ?? false
      }
      return token
    },

    /**
     * session — called on every getServerSession / useSession call.
     * Only expose what the client needs; source from token (not raw DB).
     */
    async session({ session, token }) {
      session.user.id = (token.id as string) ?? token.sub ?? ''
      session.user.role = (token.role as string) ?? 'user'
      session.user.onboardingCompleted = (token.onboardingCompleted as boolean) ?? false
      return session
    },
  },

  events: {
    async createUser({ user }) {
      logger.info('New user created', { id: user.id, email: user.email })
    },
  },

  // Trust the NEXTAUTH_URL or NEXT_PUBLIC_APP_URL for redirect validation
  trustHost: true,
})
