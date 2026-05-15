import { type HTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('bg-surface border border-line rounded-md transition-shadow', {
  variants: {
    variant: {
      default: 'shadow-1',
      feature: 'shadow-2',
      flat: 'shadow-none',
      interactive: 'shadow-1 hover:shadow-2 hover:border-line-2 cursor-pointer',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...props} />
  )
)
Card.displayName = 'Card'

export { Card, cardVariants }
