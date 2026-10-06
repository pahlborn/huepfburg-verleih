import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  sun: 'bg-accent text-accent-foreground hover:bg-accent/85',
  outline: 'border-2 border-primary/25 bg-background text-primary hover:border-primary hover:bg-secondary',
  ghost: 'text-foreground hover:bg-secondary',
} as const

const sizes = {
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-7 text-base sm:text-lg',
} as const

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function LinkButton({ variant = 'primary', size = 'md', className, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-heading font-medium whitespace-nowrap transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
