import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PageTitleProps {
  children: ReactNode
  className?: string
}

/**
 * Display-font page title. Standard responsive scale shared across all
 * listing and landing-style pages so titles feel consistent between routes.
 */
export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1
      className={cn(
        'text-foreground font-display text-[32px] leading-[1.06] font-bold tracking-[-0.025em] sm:text-[48px] sm:leading-[1.04] md:text-[56px] md:leading-[1.02] lg:text-[64px]',
        className,
      )}
    >
      {children}
    </h1>
  )
}
