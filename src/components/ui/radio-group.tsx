'use client'

import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
}

export interface RadioGroupProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  className?: string
}

export function RadioGroup({ name, value, onChange, options, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn('flex flex-col gap-2', className)}>
      {options.map((opt) => {
        const id = `${name}-${opt.value}`
        const checked = opt.value === value
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors',
              checked
                ? 'border-brand bg-brand-tint/40'
                : 'border-line-2 bg-surface hover:border-line-2 hover:bg-paper-alt'
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="mt-1 h-4 w-4 accent-brand"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">{opt.label}</span>
              {opt.description && <span className="text-xs text-ink-soft">{opt.description}</span>}
            </div>
          </label>
        )
      })}
    </div>
  )
}

export type RadioProps = InputHTMLAttributes<HTMLInputElement>

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ className, ...props }, ref) => (
  <input ref={ref} type="radio" className={cn('h-4 w-4 accent-brand', className)} {...props} />
))
Radio.displayName = 'Radio'
