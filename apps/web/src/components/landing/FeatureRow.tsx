import { cn } from '@/lib/utils'
import Link from 'next/link'

interface FeatureRowProps {
  index: string
  title: string
  description: string
  tags: string[]
  status?: 'available' | 'soon'
  href?: string
  actionLabel?: string
  className?: string
}

export function FeatureRow({
  index,
  title,
  description,
  tags,
  status = 'available',
  href,
  actionLabel = 'Ver concursos →',
  className,
}: FeatureRowProps) {
  const isSoon = status === 'soon'

  return (
    <li
      aria-disabled={isSoon || undefined}
      className={cn(
        'border-border flex flex-col gap-4 py-8 md:grid md:grid-cols-[88px_minmax(0,380px)_1fr_120px] md:items-start md:gap-12 md:py-10',
        className,
      )}
    >
      <div className="flex items-center justify-between md:contents">
        <span className={cn('text-eyebrow text-accent-brand md:pt-3', isSoon && 'opacity-60')}>
          {index}
        </span>
        {(() => {
          if (isSoon) {
            return (
              <span className="text-eyebrow text-muted-foreground/80 md:order-last md:pt-3.5 md:text-right">
                Em breve
              </span>
            )
          }
          if (href) {
            return (
              <Link
                href={href}
                className="text-eyebrow text-foreground hover:text-accent-brand cursor-pointer transition-colors md:order-last md:pt-3.5 md:text-right"
              >
                {actionLabel}
              </Link>
            )
          }
          return null
        })()}
      </div>
      <h3
        className={cn(
          'text-foreground font-display text-[2rem] leading-[1.02] font-bold tracking-[-0.025em] md:text-[2.25rem] lg:text-[2.5rem]',
          isSoon && 'opacity-60',
        )}
      >
        {title}
      </h3>
      <div className={cn('flex flex-col gap-4 md:pt-2', isSoon && 'opacity-60')}>
        <p className="text-foreground text-[1rem] leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {tags.map((tag) => (
            <span key={tag} className="text-meta text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </li>
  )
}
