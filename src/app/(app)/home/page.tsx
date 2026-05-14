import type { Metadata } from 'next'
import { auth } from '@/auth'
import { BrandMark } from '@/components/layout/brand-mark'
import { features } from '@/config/features'

export const metadata: Metadata = { title: 'Home' }

/** Step 1 placeholder home page — confirms authentication works. */
export default async function HomePage() {
  const session = await auth()
  const user = session!.user

  const firstName = user.name?.split(' ')[0] ?? 'there'

  return (
    <div className="animate-fade-in">
      {/* Welcome header */}
      <div className="mb-8">
        <p className="eyebrow mb-1">Dashboard</p>
        <h1 className="text-[28px] font-extrabold tracking-tight text-ink">
          Welcome, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Your trading education journey starts here.</p>
      </div>

      {/* Auth success confirmation card */}
      <div className="mb-6 rounded-lg border border-success/30 bg-success-tint p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-success text-sm text-white">
            ✓
          </div>
          <div>
            <p className="font-semibold text-ink">Authentication working</p>
            <p className="mt-1 text-sm text-ink-soft">
              You&apos;re signed in as <strong>{user.email}</strong>. Step 1 is complete.
            </p>
          </div>
        </div>
      </div>

      {/* Coming soon features */}
      <div className="rounded-lg border border-line bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <BrandMark size="sm" />
          <h2 className="font-bold text-ink">What&apos;s coming next</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: '📚',
              label: 'Learning modules',
              desc: 'Stocks, crypto & forex lessons',
              flag: features.lessons,
            },
            {
              icon: '🤖',
              label: 'AI assistant (Fin)',
              desc: 'Powered by Ollama',
              flag: features.chatbot,
            },
            {
              icon: '📈',
              label: 'Live market data',
              desc: 'Real-time prices',
              flag: features.liveMarket,
            },
            {
              icon: '🧪',
              label: 'Practice trading',
              desc: 'Paper trading simulator',
              flag: features.paperTrading,
            },
            { icon: '🎯', label: 'Quizzes', desc: 'Test your knowledge', flag: features.quizzes },
            {
              icon: '📓',
              label: 'Trading journal',
              desc: 'Track your progress',
              flag: features.journal,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-md border border-line p-3.5"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{item.desc}</p>
                <span className="mt-1.5 inline-block rounded-pill bg-paper-alt px-2 py-0.5 text-[10px] font-semibold text-ink-faint">
                  {item.flag ? 'Active' : 'Coming soon'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User info (dev debug — remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 rounded-md border border-line-2 p-4">
          <summary className="cursor-pointer text-xs font-semibold text-ink-faint">
            🔧 Dev — Session data
          </summary>
          <pre className="mt-3 overflow-x-auto font-mono text-xs text-ink-soft">
            {JSON.stringify(
              {
                id: user.id,
                email: user.email,
                role: user.role,
                onboardingCompleted: user.onboardingCompleted,
              },
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  )
}
