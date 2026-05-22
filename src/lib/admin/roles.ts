/**
 * Admin domain — role constants. Pure values; safe to import anywhere.
 *
 * Roles are stored on User.role as a plain string in the DB (Prisma migration
 * predates this enum), so this module is the single source of truth for the
 * "user" | "admin" union across the app.
 */

export const ROLES = ['user', 'admin'] as const
export type Role = (typeof ROLES)[number]

export function isValidRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}
