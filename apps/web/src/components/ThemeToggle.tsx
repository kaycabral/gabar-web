'use client'

import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <span className="block h-9 w-9" aria-hidden="true" />
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="text-muted-foreground rounded-full"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={resolvedTheme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem]" />
      )}
    </Button>
  )
}
