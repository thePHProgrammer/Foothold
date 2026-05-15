import type { Metadata } from 'next'

import { DecodeTool } from '@/components/glossary/decode-tool'
import { GlossaryList } from '@/components/glossary/glossary-list'
import { GLOSSARY } from '@/data/glossary'

export const metadata: Metadata = { title: 'Glossary — Foothold' }

export default function GlossaryPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <p className="eyebrow mb-1">Glossary</p>
        <h1 className="text-h1 text-ink">Decode the jargon</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Trading is full of confusing terms. Paste any sentence to translate it, or browse the A–Z
          list below.
        </p>
      </div>

      <DecodeTool />

      <div>
        <h2 className="text-h3 text-ink">All terms</h2>
        <p className="mt-1 text-sm text-ink-soft">{GLOSSARY.length} definitions and growing.</p>
        <div className="mt-4">
          <GlossaryList terms={GLOSSARY} />
        </div>
      </div>
    </div>
  )
}
