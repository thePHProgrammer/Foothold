import { z } from 'zod'

/** Profile shape returned by Google OAuth. */
export const googleProfileSchema = z.object({
  sub: z.string(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().url().optional(),
  email: z.string().email(),
  email_verified: z.boolean().optional(),
})

/** Shape of user stored in JWT token. */
export const jwtTokenSchema = z.object({
  sub: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().email().optional(),
  picture: z.string().url().nullable().optional(),
  role: z.string().default('user'),
  onboardingCompleted: z.boolean().default(false),
  iat: z.number().optional(),
  exp: z.number().optional(),
})

/** Shape passed to session callback. */
export const sessionUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().email().optional(),
  image: z.string().url().nullable().optional(),
  role: z.string().default('user'),
  onboardingCompleted: z.boolean().default(false),
})

export type GoogleProfile = z.infer<typeof googleProfileSchema>
export type JwtToken = z.infer<typeof jwtTokenSchema>
export type SessionUser = z.infer<typeof sessionUserSchema>
