'use server'

import { revalidatePath } from 'next/cache'

import { type AdminErrorCode } from '@/lib/admin/constants'
import { logger } from '@/lib/logger'
import { updateRoleSchema } from '@/lib/validations/admin'
import { requireAuth } from '@/server/auth'
import * as adminService from '@/server/services/admin.service'

export type AdminActionResult = { ok: true } | { ok: false; code: AdminErrorCode }

/**
 * Resolves the session and asserts admin role. Returns a typed FORBIDDEN
 * code rather than throwing so a stale tab (whose JWT thinks it's still
 * admin) can render a friendly toast instead of a Next.js error boundary.
 */
async function resolveAdminSession() {
  const session = await requireAuth()
  if (session.user.role !== 'admin') {
    return { ok: false as const, code: 'FORBIDDEN' as const }
  }
  return { ok: true as const, session }
}

export async function updateUserRoleAction(input: unknown): Promise<AdminActionResult> {
  const resolved = await resolveAdminSession()
  if (!resolved.ok) return { ok: false, code: resolved.code }

  const parsed = updateRoleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: 'VALIDATION' }

  const result = await adminService.updateUserRole({
    adminId: resolved.session.user.id,
    targetUserId: parsed.data.userId,
    newRole: parsed.data.role,
  })
  if (!result.ok) return { ok: false, code: result.code }

  revalidatePath('/admin')
  logger.info('admin role changed', {
    adminId: resolved.session.user.id,
    targetUserId: parsed.data.userId,
    oldRole: result.oldRole,
    newRole: parsed.data.role,
  })

  return { ok: true }
}
