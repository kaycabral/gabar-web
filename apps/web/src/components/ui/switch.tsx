'use client'

import { cn } from '@/lib/utils'
import { Switch as SwitchPrimitive } from 'radix-ui'

function Switch({ className, ...props }: SwitchPrimitive.SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-[18.4px] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform',
          'data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
