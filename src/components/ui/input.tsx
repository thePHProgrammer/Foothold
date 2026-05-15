import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-sm border border-line-2 bg-surface px-3 py-2 text-sm text-ink',
        'placeholder:text-ink-faint',
        'focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-colors',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
