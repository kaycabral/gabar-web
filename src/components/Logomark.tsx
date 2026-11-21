import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'

interface LogomarkProps {
  size?: Size
  showBeta?: boolean
  className?: string
}

const wordClass: Record<Size, string> = {
  sm: 'text-[1.375rem]',
  md: 'text-[2.25rem]',
  lg: 'text-[3.5rem]',
}

const betaClass: Record<Size, string> = {
  sm: 'text-meta',
  md: 'text-eyebrow',
  lg: 'text-eyebrow',
}

export function Logomark({ size = 'sm', showBeta = true, className }: LogomarkProps) {
  return (
    <span className={cn('flex items-baseline gap-2.5', className)}>
      <span
        className={cn(
          'font-display text-foreground leading-none font-extrabold tracking-[-0.025em]',
          wordClass[size],
          size !== 'sm' && 'tracking-[-0.035em]',
          size === 'sm' && 'tracking-[-0.02em]',
        )}
      >
        gabar
      </span>
      {showBeta ? <span className={cn('text-accent-brand', betaClass[size])}>Beta</span> : null}
    </span>
  )
}
