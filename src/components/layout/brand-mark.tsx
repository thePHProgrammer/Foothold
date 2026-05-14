import { cn } from '@/lib/utils'

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { outer: 'h-7 w-7 rounded-[8px]', text: 'text-sm' },
  md: { outer: 'h-8 w-8 rounded-[10px]', text: 'text-sm' },
  lg: { outer: 'h-11 w-11 rounded-[12px]', text: 'text-xl' },
}

/** The Foothold "F" brand mark — dark square with a terracotta radial circle. */
export function BrandMark({ size = 'md', className }: BrandMarkProps) {
  const s = sizes[size]
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-ink',
        s.outer,
        className
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 70% 30%, #D97757 0 36%, transparent 37%)',
          opacity: 0.95,
        }}
      />
      <span className={cn('relative z-10 font-extrabold text-paper', s.text)}>F</span>
    </div>
  )
}
