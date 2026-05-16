/** Presentational chip for a journal entry's linked-trade snapshot. */
export function JournalTradeChip({ snapshot }: { snapshot: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-brand/30 bg-brand-tint/50 px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-ink">
      <span aria-hidden>🔗</span>
      {snapshot}
    </span>
  )
}
