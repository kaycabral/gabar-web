import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

type Tone = 'paper' | 'sand' | 'ink' | 'accent'

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone
  divide?: boolean
  size?: 'default' | 'compact' | 'tall' | 'none'
  children: ReactNode
}

const toneClass: Record<Tone, string> = {
  paper: 'bg-background text-foreground',
  sand: 'bg-muted text-foreground',
  ink: 'bg-foreground text-background',
  accent: 'bg-accent-brand text-accent-brand-foreground',
}

const sizeClass: Record<NonNullable<PageSectionProps['size']>, string> = {
  default: 'py-24 md:py-32 lg:py-36',
  compact: 'py-16 md:py-20 lg:py-24',
  tall: 'py-28 md:py-36 lg:py-40',
  none: '',
}

export function PageSection({
  tone = 'paper',
  divide = false,
  size = 'default',
  className,
  children,
  ...rest
}: PageSectionProps) {
  return (
    <section
      className={cn(
        'relative w-full px-6 sm:px-10 lg:px-14',
        toneClass[tone],
        sizeClass[size],
        divide && 'border-border border-t',
        tone === 'ink' && divide && 'border-foreground/15',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  )
}
