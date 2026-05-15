import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-semibold whitespace-nowrap rounded-pill border',
  {
    variants: {
      variant: {
        outline: 'bg-transparent border-line-2 text-ink-soft',
        brand: 'bg-brand-tint border-brand/30 text-brand-ink',
        success: 'bg-success-tint border-success/30 text-success',
        warn: 'bg-warn-tint border-warn/30 text-warn',
        danger: 'bg-danger-tint border-danger/30 text-danger',
        neutral: 'bg-paper-alt border-line text-ink-soft',
        crypto: 'bg-brand-tint border-brand/30 text-brand-ink',
        stocks: 'bg-success-tint border-success/30 text-success',
        forex: 'bg-warn-tint border-warn/30 text-warn',
      },
      size: {
        sm: 'h-5 px-2 text-[10px]',
        md: 'h-6 px-2.5 text-[11px]',
        lg: 'h-7 px-3 text-[12px]',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
