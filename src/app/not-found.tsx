import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-4 text-center">
      <div className="text-6xl font-extrabold tracking-tight text-ink">404</div>
      <div>
        <h1 className="text-h3 text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-ink-soft">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/home"
        className="rounded-sm bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
      >
        Back to home
      </Link>
    </div>
  )
}
