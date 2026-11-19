'use client'

import { cn } from '@/lib/utils'
import { Slot } from 'radix-ui'
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type Variant = 'primary' | 'accent' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface PillButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: Variant
  size?: Size
  trailing?: ReactNode | false
  asChild?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-foreground text-background hover:bg-foreground/90',
  accent: 'bg-accent-brand text-accent-brand-foreground hover:brightness-[0.96]',
  outline:
    'border-foreground bg-background text-foreground hover:bg-foreground hover:text-background border',
}

const sizeClass: Record<Size, string> = {
  sm: 'gap-2 px-4 py-2.5 text-[0.8125rem]',
  md: 'gap-6 px-6 py-4 text-[0.9375rem]',
  lg: 'gap-8 px-9 py-6 text-[1.0625rem]',
}

const trailingSizeClass: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(function PillButton(
  {
    variant = 'primary',
    size = 'md',
    trailing = '→',
    asChild = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      ref={ref as never}
      className={cn(
        'inline-flex cursor-pointer items-center rounded-full font-medium tracking-[-0.01em] transition-colors',
        variantClass[variant],
        sizeClass[size],
        trailing === false && 'justify-center',
        trailing !== false && 'justify-between',
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      {trailing !== false ? (
        <span aria-hidden className={trailingSizeClass[size]}>
          {trailing}
        </span>
      ) : null}
    </Comp>
  )
})
