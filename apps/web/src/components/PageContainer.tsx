import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

interface PageContainerProps<T extends ElementType = 'div'> {
  children: ReactNode
  className?: string
  as?: T
}

/**
 * Horizontal-only page container. Responsible for max-width and x-padding
 * across all routes so navigating between pages doesn't cause a layout
 * flicker. Vertical spacing is the caller's job — pass it via `className`.
 */
export function PageContainer<T extends ElementType = 'div'>({
  children,
  className,
  as,
  ...rest
}: PageContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof PageContainerProps<T>>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      className={cn('mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-14', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
