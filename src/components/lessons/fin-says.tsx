export function FinSays({ text }: { text: string }) {
  return (
    <aside className="flex gap-3 rounded-md border border-line-2 bg-paper-alt/40 p-4">
      <FinAvatar />
      <div className="flex-1">
        <p className="eyebrow mb-1 text-brand">Fin says</p>
        <p className="text-sm leading-relaxed text-ink">{text}</p>
      </div>
    </aside>
  )
}

function FinAvatar() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="var(--brand-tint, #fbe9df)"
        stroke="var(--brand, #d97757)"
        strokeWidth="1.5"
      />
      <path
        d="M14 22 Q20 28 26 22"
        fill="none"
        stroke="var(--brand, #d97757)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="15" cy="17" r="1.6" fill="var(--brand, #d97757)" />
      <circle cx="25" cy="17" r="1.6" fill="var(--brand, #d97757)" />
      <path
        d="M10 14 L13 11"
        stroke="var(--brand, #d97757)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M30 14 L27 11"
        stroke="var(--brand, #d97757)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
