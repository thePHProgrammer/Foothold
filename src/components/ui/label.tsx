import { type LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-semibold leading-tight text-ink', className)}
    {...props}
  />
))
Label.displayName = 'Label'

export { Label }
