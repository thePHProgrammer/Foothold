export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-4">
        {/* Brand mark */}
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] bg-ink">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 70% 30%, #D97757 0 36%, transparent 37%)',
              opacity: 0.95,
            }}
          />
          <span className="relative z-10 text-base font-extrabold text-paper">F</span>
        </div>
        {/* Spinner */}
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-line-2 border-t-brand"
          aria-label="Loading"
        />
      </div>
    </div>
  )
}
