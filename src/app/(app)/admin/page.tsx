import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AdminAuditLog } from '@/components/admin/admin-audit-log'
import { AdminFlagInspector } from '@/components/admin/admin-flag-inspector'
import { AdminUserRow } from '@/components/admin/admin-user-row'
import { Card } from '@/components/ui/card'
import { features } from '@/config/features'
import { getCurrentSession } from '@/server/auth'
import { getAdminDashboardData } from '@/server/services/admin.service'

export const metadata: Metadata = { title: 'Admin — Foothold' }

/**
 * Admin dashboard. Single page, three sections (Users, Audit log, Flags) —
 * single-page composition mirrors the watchlists page; sub-routes will only
 * be promoted when one section grows pagination/filters.
 *
 * Gating: `notFound()` (not redirect to /access-denied) is deliberate
 * security-through-obscurity — the admin surface is invisible to non-admins.
 * UX tradeoff: makes onboarding new admins slightly harder (no breadcrumb
 * if the role bit didn't propagate). For an internal admin surface this is
 * the right tradeoff; do not "fix" it without a UX reason.
 */
export default async function AdminPage() {
  if (!features.adminCms) notFound()

  const session = await getCurrentSession()
  if (session?.user?.role !== 'admin') notFound()

  const { users, auditLogs, flags } = await getAdminDashboardData()
  const selfId = session.user.id

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Admin</p>
        <h1 className="text-h1 text-ink">Operator dashboard</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Manage roles, audit recent admin activity, and inspect feature flags. All role changes are
          logged.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-h3 text-ink">Users</h2>
        <Card padding="none" className="overflow-hidden">
          <ul className="divide-y divide-line">
            {users.map((user) => (
              <AdminUserRow key={user.id} user={user} isSelf={user.id === selfId} />
            ))}
          </ul>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 text-ink">Recent activity</h2>
        <AdminAuditLog entries={auditLogs} />
      </section>

      <section className="space-y-3">
        <h2 className="text-h3 text-ink">Feature flags</h2>
        <AdminFlagInspector flags={flags} />
      </section>
    </div>
  )
}
