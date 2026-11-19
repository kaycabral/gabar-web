import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

interface ContainerProps<T extends ElementType = 'div'> {
  as?: T
  narrow?: boolean
  className?: string
  children: ReactNode
}

export function Container<T extends ElementType = 'div'>({
  as,
  narrow = false,
  className,
  children,
  ...rest
}: ContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      className={cn('mx-auto w-full px-6', narrow ? 'max-w-[840px]' : 'max-w-[1120px]', className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}
