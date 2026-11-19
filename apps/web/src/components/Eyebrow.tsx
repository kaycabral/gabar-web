import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

interface EyebrowProps<T extends ElementType = 'p'> {
  as?: T
  index?: string
  className?: string
  children: ReactNode
}

/**
 * Section eyebrow: orange accent line + orange uppercase label.
 * Pass `index` to prefix with a numeric section marker (e.g. "01").
 */
export function Eyebrow<T extends ElementType = 'p'>({
  as,
  index,
  className,
  children,
  ...rest
}: EyebrowProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof EyebrowProps<T>>) {
  const Tag = (as ?? 'p') as ElementType
  return (
    <Tag
      className={cn(
        'text-accent-brand inline-flex items-center gap-2.5 text-[10.5px] font-semibold tracking-[0.14em] uppercase sm:text-[11px]',
        className,
      )}
      {...rest}
    >
      {index && <span className="tabular-nums">{index}</span>}
      <span aria-hidden className="bg-accent-brand inline-block h-px w-5 shrink-0 sm:w-6" />
      <span>{children}</span>
    </Tag>
  )
}
