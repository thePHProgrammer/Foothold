import { Card } from '@/components/ui/card'
import type { NewsArticle } from '@/server/services/watchlist.service'

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function formatWhen(iso: string): string {
  try {
    return timeFmt.format(new Date(iso))
  } catch {
    return ''
  }
}

export function NewsFeed({ news, available }: { news: NewsArticle[]; available: boolean }) {
  return (
    <section className="space-y-3">
      <h2 className="text-h3 text-ink">
        <span aria-hidden className="mr-1">
          📰
        </span>
        Market news
      </h2>

      {!available || news.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-sm font-semibold text-ink-soft">Market news is unavailable</p>
          <p className="mt-1 text-[12px] text-ink-faint">
            The news provider needs an API key. Prices above still update normally.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {news.map((a) => (
            <li key={a.id}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-line bg-surface p-4 no-underline transition-colors hover:bg-paper-alt"
              >
                <p className="text-sm font-bold text-ink">{a.headline}</p>
                {a.summary && (
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                    {a.summary}
                  </p>
                )}
                <p className="mt-2 font-mono text-[11px] text-ink-faint">
                  {a.source} · {formatWhen(a.publishedAt)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
