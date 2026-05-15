export function MarketDisclaimer() {
  return (
    <aside
      role="note"
      className="rounded-md border border-line bg-paper-alt/40 p-4 text-xs leading-relaxed text-ink-soft"
    >
      <p className="mb-1 font-bold uppercase tracking-wider text-ink-faint">Disclaimer</p>
      <p>
        Educational use only. <strong className="text-ink">Not financial advice.</strong> Prices may
        be delayed: US equities are typically 15 minutes behind, forex pairs are derived from
        published rates, and any single quote can fail. Always verify with your broker before
        trading. Foothold is a learning platform, not a brokerage.
      </p>
    </aside>
  )
}
