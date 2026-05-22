/**
 * Admin domain constants. Pure values — safe to import anywhere.
 */

/** Typed admin failures → friendly copy (exhaustive). */
export type AdminErrorCode =
  | 'VALIDATION'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'SELF_DEMOTE_BLOCKED'
  | 'LAST_ADMIN_BLOCKED'

const ADMIN_ERROR_MESSAGES: Record<AdminErrorCode, string> = {
  VALIDATION: 'That request was invalid — please try again.',
  FORBIDDEN: 'You no longer have admin access. Sign in again and retry.',
  NOT_FOUND: 'That user no longer exists.',
  SELF_DEMOTE_BLOCKED: 'You can’t demote yourself — ask another admin to do it.',
  LAST_ADMIN_BLOCKED: 'At least one admin must remain — promote someone else first.',
}

export function messageForAdminError(code: AdminErrorCode): string {
  return ADMIN_ERROR_MESSAGES[code]
}

/** Max audit-log rows shown on the dashboard. Pagination deferred until volume warrants it. */
export const AUDIT_LOG_LIMIT = 50
