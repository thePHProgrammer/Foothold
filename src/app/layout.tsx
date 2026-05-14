import type { Metadata, Viewport } from 'next'
import { manrope, jetbrainsMono } from '@/styles/fonts'
import { SessionProvider } from '@/components/layout/session-provider'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Foothold — Learn to Trade',
    template: '%s | Foothold',
  },
  description:
    'A free, mobile-first platform to learn stocks, crypto, and forex — one step at a time. No real money needed.',
  keywords: ['trading', 'stocks', 'crypto', 'forex', 'learn to trade', 'trading education'],
  authors: [{ name: 'Foothold' }],
  openGraph: {
    type: 'website',
    title: 'Foothold — Learn to Trade',
    description: 'Free trading education for stocks, crypto, and forex.',
    siteName: 'Foothold',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foothold — Learn to Trade',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D97757',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
