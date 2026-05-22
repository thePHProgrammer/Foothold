import type { AdminAuditLog, User } from '@prisma/client'

import { logger } from '@/lib/logger'
import type { Role } from '@/lib/admin/roles'
import { prisma } from '@/server/db'

/**
 * Persistence-only layer for admin operations. Service-layer guardrails
 * (self-demote, last-admin, NOT_FOUND) live in admin.service.ts — this file
 * only talks to Prisma.
 *
 * The atomic role-change-with-audit lives here (not in the service) so that
 * `prisma.$transaction` stays inside the repo layer — mirrors the onboarding
 * repository's array-form transaction pattern (required for Neon's PgBouncer
 * transaction-mode connection).
 */

export type AdminUserRow = Pick<User, 'id' | 'name' | 'email' | 'image' | 'role' | 'createdAt'>

export type AdminAuditLogRow = AdminAuditLog & {
  admin: Pick<User, 'id' | 'name' | 'email'> | null
  target: Pick<User, 'id' | 'name' | 'email'> | null
}

/**
 * Paginated signature from day one — v1 UI calls without args (default 100).
 * Admin tables get unusable around 300–500 users; structuring the repo for
 * pagination now avoids a forced API rewrite later.
 */
export async function listUsers(
  options: { take?: number; cursor?: string } = {}
): Promise<AdminUserRow[]> {
  const { take = 100, cursor } = options
  return prisma.user.findMany({
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  })
}

export async function getUserById(id: string): Promise<AdminUserRow | null> {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  })
}

export async function countAdmins(): Promise<number> {
  return prisma.user.count({ where: { role: 'admin' } })
}

/**
 * Atomically updates User.role AND inserts the AdminAuditLog row in a single
 * transaction. Caller has already passed all guardrails (NOT_FOUND, idempotent
 * no-op, self-demote, last-admin) in admin.service.ts.
 *
 * Uses array form $transaction (NOT callback form) — required for Neon's
 * pooled PgBouncer transaction-mode connection. Do not "improve" to the
 * callback form or live writes will fail in production. Mirrors
 * onboarding.repository.saveOnboardingPreferences.
 */
export async function applyRoleChangeWithAudit(input: {
  adminId: string
  targetUserId: string
  oldRole: Role
  newRole: Role
}): Promise<void> {
  const { adminId, targetUserId, oldRole, newRole } = input
  const userUpdate = prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  })
  const auditInsert = prisma.adminAuditLog.create({
    data: {
      adminId,
      targetUserId,
      action: 'ROLE_CHANGE',
      oldValue: oldRole,
      newValue: newRole,
    },
  })

  try {
    await prisma.$transaction([userUpdate, auditInsert])
  } catch (error) {
    logger.error('Failed to apply role change with audit', {
      error,
      adminId,
      targetUserId,
      oldRole,
      newRole,
    })
    throw error
  }
}

// TODO(perf): once audit volume grows, swap `include` for an explicit
// `select` projection — `include` pulls every column on both User relations
// by default, which becomes accidental overfetching at scale.
export async function listAuditLogs(options: { limit?: number } = {}): Promise<AdminAuditLogRow[]> {
  const { limit = 50 } = options
  return prisma.adminAuditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      admin: { select: { id: true, name: true, email: true } },
      target: { select: { id: true, name: true, email: true } },
    },
  })
}
