import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// `cn` for Gabar's own components. Same as @cbrl/design's, plus Gabar's
// typography utilities (globals.css) registered as font sizes, so tailwind-merge
// does not mistake `text-h2` for a text color and drop it next to `text-muted-foreground`.
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
