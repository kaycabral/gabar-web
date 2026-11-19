import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  label: ReactNode
  meta?: ReactNode
  tone?: 'light' | 'dark' | 'accent'
  className?: string
}

function metaColorFor(tone: NonNullable<SectionHeaderProps['tone']>): string {
  if (tone === 'dark') return 'text-background/55'
  if (tone === 'accent') return 'text-foreground/70'
  return 'text-muted-foreground'
}

export function SectionHeader({ label, meta, tone = 'light', className }: SectionHeaderProps) {
  const labelColor = tone === 'dark' ? 'text-background' : 'text-foreground'
  const metaColor = metaColorFor(tone)

  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-x-6 gap-y-2',
        'mb-16 md:mb-20',
        className,
      )}
    >
      <span className={cn('text-eyebrow', labelColor)}>{label}</span>
      {meta ? <span className={cn('text-eyebrow', metaColor)}>{meta}</span> : null}
    </div>
  )
}
