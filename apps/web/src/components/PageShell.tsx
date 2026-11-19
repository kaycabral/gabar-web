import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
}

/**
 * Top-level <main> for a route. Offsets the fixed Nav (mt-16), fills the
 * viewport height (so footers stay at the bottom on short pages), and gives
 * the body a consistent background. Inner layout is the caller's job.
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn('bg-background mt-16 flex min-h-[calc(100vh-4rem)] flex-col', className)}>
      {children}
    </main>
  )
}
