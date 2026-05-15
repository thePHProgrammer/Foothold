'use client'

import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { decodeText, type DecodeResult } from '@/actions/glossary'

const PLACEHOLDER = `Paste a confusing sentence — e.g.

"BTC broke resistance on the 4H, RSI is overbought but the EMA crossover is bullish. Risk 1% per trade."`

export function DecodeTool() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<DecodeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function onDecode() {
    setError(null)
    startTransition(async () => {
      try {
        const r = await decodeText({ text })
        setResult(r)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not decode text')
      }
    })
  }

  return (
    <Card padding="lg" className="space-y-4">
      <div>
        <h2 className="text-h3 text-ink">Decode the jargon</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Paste any sentence with finance jargon — we&apos;ll explain it in plain English.
        </p>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={6}
        maxLength={5000}
        aria-label="Text to decode"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-ink-faint">{text.length} / 5000</span>
        <Button variant="primary" onClick={onDecode} disabled={isPending || !text.trim()}>
          {isPending ? 'Decoding…' : 'Decode'}
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-sm border border-line bg-paper p-4">
            <p className="eyebrow mb-2">Plain English</p>
            <p className="whitespace-pre-wrap text-sm text-ink">{result.plainEnglish}</p>
          </div>
          <div className="rounded-sm border border-brand/30 bg-brand-tint/40 p-4">
            <p className="eyebrow mb-2">Terms found ({result.matched.length})</p>
            {result.matched.length === 0 ? (
              <p className="text-sm text-ink-soft">
                No glossary terms matched. Try adding some jargon.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {result.matched.map((t) => (
                  <li key={t.slug}>
                    <strong className="text-ink">{t.term}</strong>
                    <span className="ml-1 text-ink-soft">— {t.definition}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
