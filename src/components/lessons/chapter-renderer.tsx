import { cn } from '@/lib/utils'
import type { Block } from '@/types/lessons'

const CALLOUT_STYLES: Record<Extract<Block, { kind: 'callout' }>['tone'], string> = {
  info: 'border-brand/30 bg-brand-tint/40 text-ink',
  warn: 'border-warn/40 bg-warn-tint/60 text-ink',
  sources: 'border-line bg-paper-alt/60 text-ink-soft',
}

export function ChapterRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return <p className="text-[15px] leading-relaxed text-ink">{block.text}</p>
    case 'h2':
      return <h2 className="mt-8 text-h3 text-ink">{block.text}</h2>
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul'
      return (
        <Tag
          className={cn(
            'space-y-2 pl-5 text-[15px] leading-relaxed text-ink',
            block.ordered ? 'list-decimal' : 'list-disc'
          )}
        >
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </Tag>
      )
    }
    case 'callout':
      return (
        <div className={cn('rounded-md border-l-4 px-4 py-3 text-sm', CALLOUT_STYLES[block.tone])}>
          {block.tone === 'sources' && <p className="eyebrow mb-1 text-ink-faint">Sources</p>}
          <p>{block.text}</p>
        </div>
      )
    case 'image':
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} className="w-full rounded-md border border-line" />
          {block.caption && (
            <figcaption className="mt-1 text-center text-xs text-ink-faint">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
  }
}
