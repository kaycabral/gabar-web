import { cn } from '@/lib/utils'

interface StatPairProps {
  value: string
  label: string
  accent?: boolean
  className?: string
}

export function StatPair({ value, label, accent = false, className }: StatPairProps) {
  return (
    <div className={cn('flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3', className)}>
      <dt className="sr-only">{label}</dt>
      <dd
        className={cn(
          'font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.035em] md:text-[3.5rem]',
          accent ? 'text-accent-brand' : 'text-foreground',
        )}
      >
        {value}
      </dd>
      <span className="text-meta text-muted-foreground">{label}</span>
    </div>
  )
}
