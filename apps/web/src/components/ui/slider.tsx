'use client'

import { Slider as SliderPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

const THUMB_LABELS_DEFAULT = ['Mínimo', 'Máximo']

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(() => {
    if (Array.isArray(value)) return value
    if (Array.isArray(defaultValue)) return defaultValue
    return [min, max]
  }, [value, defaultValue, min, max])

  return (
    <SliderPrimitive.Root
      role="group"
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-muted relative h-1 w-full grow overflow-hidden rounded-full"
      >
        <SliderPrimitive.Range data-slot="slider-range" className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={THUMB_LABELS_DEFAULT[index] ?? `Valor ${index + 1}`}
          className="border-ring ring-ring/50 block size-3 shrink-0 rounded-full border bg-white transition-[color,box-shadow] select-none hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
