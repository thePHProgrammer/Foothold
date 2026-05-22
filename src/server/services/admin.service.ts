import { type AdminErrorCode, AUDIT_LOG_LIMIT } from '@/lib/admin/constants'
import { isValidRole, type Role } from '@/lib/admin/roles'
import { features } from '@/config/features'
import * as adminRepo from '@/server/repositories/admin.repository'
import type { AdminAuditLogRow, AdminUserRow } from '@/server/repositories/admin.repository'

export type AdminResult = { ok: true; oldRole: Role } | { ok: false; code: AdminErrorCode }

export type AdminDashboardData = {
  users: AdminUserRow[]
  auditLogs: AdminAuditLogRow[]
  flags: typeof features
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [users, auditLogs] = await Promise.all([
    adminRepo.listUsers(),
    adminRepo.listAuditLogs({ limit: AUDIT_LOG_LIMIT }),
  ])
  return { users, auditLogs, flags: features }
}

/**
 * Guardrails before delegating the atomic write to the repo:
 *
 *   1. NOT_FOUND — target must exist.
 *   2. Idempotent no-op — role already matches; return ok without audit row.
 *   3. SELF_DEMOTE_BLOCKED — an admin demoting themselves to "user" can
 *      lock everyone out of /admin (their JWT loses the role on next refresh,
 *      and there's no longer-running session to recover from).
 *   4. LAST_ADMIN_BLOCKED — refuses the demote that would leave zero admins.
 */
export async function updateUserRole(input: {
  adminId: string
  targetUserId: string
  newRole: Role
}): Promise<AdminResult> {
  const { adminId, targetUserId, newRole } = input

  // Defence-in-depth: zod already enforces the enum, but the repo writes the
  // string straight into User.role and any future code path that bypasses
  // validation must not corrupt the column.
  if (!isValidRole(newRole)) return { ok: false, code: 'VALIDATION' }

  const target = await adminRepo.getUserById(targetUserId)
  if (!target) return { ok: false, code: 'NOT_FOUND' }

  // Repo stores role as a plain string; coerce defensively. Any unrecognised
  // value at rest is treated as 'user' (safer than throwing in the admin UI).
  const currentRole: Role = isValidRole(target.role) ? target.role : 'user'

  if (currentRole === newRole) return { ok: true, oldRole: currentRole }

  if (adminId === targetUserId && newRole === 'user') {
    return { ok: false, code: 'SELF_DEMOTE_BLOCKED' }
  }

  if (currentRole === 'admin' && newRole === 'user') {
    // Known race condition: two concurrent admin demotions could result in
    // ZERO admins remaining — a dangerous terminal state recoverable only by
    // direct DB access. Both callers can read count=2, both pass this check,
    // both transactions commit, system ends with 0 admins.
    // Accepted temporarily for MVP/internal scale (admin set is tiny and
    // coordinated). Fix requires row-level locking (SELECT … FOR UPDATE on
    // the admin rows inside the transaction) or a serialised transaction
    // strategy. Mirrors paper-trading's deliberate single-user-sim stance.
    const adminCount = await adminRepo.countAdmins()
    if (adminCount <= 1) return { ok: false, code: 'LAST_ADMIN_BLOCKED' }
  }

  await adminRepo.applyRoleChangeWithAudit({
    adminId,
    targetUserId,
    oldRole: currentRole,
    newRole,
  })

  return { ok: true, oldRole: currentRole }
}
