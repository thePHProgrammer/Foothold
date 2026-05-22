'use client'

import { useState, useTransition } from 'react'

import { updateUserRoleAction } from '@/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { messageForAdminError } from '@/lib/admin/constants'
import { isValidRole, type Role } from '@/lib/admin/roles'

type Props = {
  user: {
    id: string
    name: string | null
    email: string | null
    role: string
  }
  isSelf: boolean
}

/**
 * Per-row role-toggle with a two-step confirm — mirrors the journal entry
 * delete pattern (useState + useTransition) so the same muscle memory works.
 *
 * Self-row guardrails are rendered inline AND enforced server-side
 * (SELF_DEMOTE_BLOCKED). The button is hidden for self-demote; promote-self
 * is also hidden because the only case it would matter is an admin viewing
 * themselves, where they're already admin (idempotent no-op).
 */
export function AdminUserRow({ user, isSelf }: Props) {
  const currentRole: Role = isValidRole(user.role) ? user.role : 'user'
  const nextRole: Role = currentRole === 'admin' ? 'user' : 'admin'
  const verb = currentRole === 'admin' ? 'Demote' : 'Promote'

  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const canAct = !isSelf

  return (
    <li className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">
          {user.name ?? 'Unnamed user'}
          {isSelf && (
            <Badge variant="outline" size="sm" className="ml-2 align-middle">
              You
            </Badge>
          )}
        </p>
        <p className="truncate font-mono text-[11px] text-ink-faint">
          {user.email ?? '(no email)'}
        </p>
        {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
      </div>

      <Badge variant={currentRole === 'admin' ? 'brand' : 'neutral'} size="md">
        {currentRole}
      </Badge>

      <div className="flex items-center justify-end gap-2">
        {!canAct ? (
          <span className="font-mono text-[11px] text-ink-faint">self-demote disabled</span>
        ) : confirming ? (
          <>
            <Button
              variant={nextRole === 'admin' ? 'success' : 'danger'}
              size="sm"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  setError(null)
                  const result = await updateUserRoleAction({
                    userId: user.id,
                    role: nextRole,
                  })
                  if (!result.ok) {
                    setError(messageForAdminError(result.code))
                  }
                  setConfirming(false)
                })
              }
            >
              {isPending ? 'Saving…' : `Confirm ${verb.toLowerCase()}`}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setError(null)
              setConfirming(true)
            }}
          >
            {verb} to {nextRole}
          </Button>
        )}
      </div>
    </li>
  )
}
