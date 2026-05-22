import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import type { AdminAuditLogRow } from '@/server/repositories/admin.repository'

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function describeUser(u: AdminAuditLogRow['admin'] | AdminAuditLogRow['target']): string {
  if (!u) return '(deleted user)'
  return u.name ?? u.email ?? '(unnamed user)'
}

export function AdminAuditLog({ entries }: { entries: AdminAuditLogRow[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon="📜"
        title="No admin activity yet"
        description="Promote or demote a user above to see the first audit entry land here."
      />
    )
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <ul className="divide-y divide-line">
        {entries.map((entry) => (
          <li key={entry.id} className="grid grid-cols-[1fr_auto] items-start gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">
                <span className="font-semibold">{describeUser(entry.admin)}</span> changed{' '}
                <span className="font-semibold">{describeUser(entry.target)}</span> from{' '}
                <Badge variant="neutral" size="sm">
                  {entry.oldValue ?? '?'}
                </Badge>{' '}
                to{' '}
                <Badge variant="brand" size="sm">
                  {entry.newValue ?? '?'}
                </Badge>
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-ink-faint">
                {entry.action.toLowerCase()}
              </p>
            </div>
            <p className="font-mono text-[11px] text-ink-faint">
              {dateFmt.format(entry.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
