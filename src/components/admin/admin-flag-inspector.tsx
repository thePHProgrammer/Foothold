import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

type Props = {
  flags: Record<string, boolean>
}

/**
 * Read-only feature-flag inspector. Editing flags lives in the codebase
 * (src/config/features.ts) — surfacing them here lets an admin confirm
 * which features are active in this deploy without trawling the repo.
 */
export function AdminFlagInspector({ flags }: Props) {
  const entries = Object.entries(flags)

  return (
    <Card padding="none" className="overflow-hidden">
      <ul className="divide-y divide-line">
        {entries.map(([name, value]) => (
          <li key={name} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3">
            <p className="font-mono text-sm font-semibold text-ink">{name}</p>
            <Badge variant={value ? 'success' : 'neutral'} size="md">
              {value ? 'on' : 'off'}
            </Badge>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-5 py-3 text-[11px] text-ink-faint">
        Read-only. Edit flags in <span className="font-mono">src/config/features.ts</span>.
      </p>
    </Card>
  )
}
