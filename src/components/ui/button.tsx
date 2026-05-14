import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold whitespace-nowrap',
    'rounded-sm border transition-all duration-120',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-brand border-brand text-white hover:bg-brand-strong hover:border-brand-strong',
        secondary: 'bg-surface border-line-2 text-ink hover:bg-paper-alt',
        ghost: 'bg-transparent border-transparent text-ink-soft hover:bg-paper-alt hover:text-ink',
        success: 'bg-success border-success text-white hover:opacity-90',
        danger: 'bg-danger border-danger text-white hover:opacity-90',
        outline: 'bg-transparent border-line-2 text-ink hover:bg-paper-alt',
      },
      size: {
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-[22px] text-[15px] rounded-md',
        xl: 'h-14 px-7 text-base rounded-md',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
