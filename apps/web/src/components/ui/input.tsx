import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:ring-ring/50 w-full rounded-md border px-3 py-1.5 text-base focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
