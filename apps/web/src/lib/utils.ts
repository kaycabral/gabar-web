import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display-xl',
        'text-display',
        'text-h1',
        'text-h2',
        'text-h3',
        'text-lede',
        'text-body',
        'text-label',
        'text-caption',
        'text-eyebrow',
        'text-meta',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
