import { cn } from '@/lib/utils'

interface PainCardProps {
  index: string
  title: string
  description: string
  className?: string
}

export function PainCard({ index, title, description, className }: PainCardProps) {
  return (
    <div className={cn('flex flex-col gap-3 py-8 md:py-10', className)}>
      <span className="text-eyebrow text-accent-brand">{index}</span>
      <h3 className="text-h3 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">{description}</p>
    </div>
  )
}
