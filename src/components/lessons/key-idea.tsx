export function KeyIdea({ text }: { text: string }) {
  return (
    <aside className="rounded-md border border-brand/30 bg-brand-tint/50 p-4">
      <p className="eyebrow mb-1 text-brand-ink">Key idea</p>
      <p className="text-[15px] font-semibold leading-snug text-ink">{text}</p>
    </aside>
  )
}
