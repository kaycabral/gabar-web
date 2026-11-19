import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface KickerProps {
  badge?: ReactNode
  className?: string
  children: ReactNode
}

export function Kicker({ badge, className, children }: KickerProps) {
  return (
    <div
      className={cn(
        'bg-muted border-border text-muted-foreground text-label inline-flex max-w-[calc(100vw-3rem)] items-center gap-2 rounded-full border px-4 py-1.5',
        badge ? 'pr-1.5' : '',
        className,
      )}
    >
      <span className="min-w-0">{children}</span>
      {badge ? (
        <span className="bg-accent-brand text-accent-brand-foreground text-caption shrink-0 rounded-full px-3 py-1 font-semibold whitespace-nowrap">
          {badge}
        </span>
      ) : null}
    </div>
  )
}
