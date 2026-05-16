import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/auth'
import { handleSignOut } from '@/actions/auth'
import { BrandMark } from './brand-mark'
import { features } from '@/config/features'
import { getInitials } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/learn', label: 'Learn' },
  { href: '/markets', label: 'Markets' },
  ...(features.paperTrading ? [{ href: '/practice', label: 'Practice' }] : []),
  ...(features.journal ? [{ href: '/journal', label: 'Journal' }] : []),
  { href: '/glossary', label: 'Glossary' },
  { href: '/progress', label: 'Progress' },
] as const

/** Server Component top navigation bar. Reads session directly from auth(). */
export async function Topbar({ activePath }: { activePath?: string }) {
  const session = await auth()
  const user = session?.user

  return (
    <header
      className="border-b border-line"
      style={{
        background: 'rgba(251,249,246,0.85)',
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
      }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 md:px-6">
        {/* Left: brand + desktop nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/learn"
            className="flex items-center gap-2.5 font-extrabold text-ink no-underline"
          >
            <BrandMark size="sm" />
            <span className="text-[19px] tracking-tight">Foothold</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'rounded-pill px-3.5 py-2 text-sm font-medium text-ink-soft no-underline transition-colors hover:bg-paper-alt hover:text-ink',
                  activePath === link.href ? 'bg-paper-alt font-semibold text-ink' : '',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: user controls */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {/* Avatar + sign-out */}
              <form action={handleSignOut}>
                <button
                  type="submit"
                  title="Sign out"
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? 'User avatar'}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
