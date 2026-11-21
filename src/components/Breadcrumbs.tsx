import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  label?: string
}

/**
 * Visual trail of parent pages. Use `items` with the last item representing
 * the current page (no href needed). Padding is the caller's responsibility —
 * wrap with the spacing that fits the page.
 */
export function Breadcrumbs({ items, className, label = 'Navegação' }: BreadcrumbsProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'text-muted-foreground flex items-center gap-2 text-[13px] sm:text-sm',
        className,
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'text-foreground' : undefined}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="text-border" aria-hidden>
                /
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
