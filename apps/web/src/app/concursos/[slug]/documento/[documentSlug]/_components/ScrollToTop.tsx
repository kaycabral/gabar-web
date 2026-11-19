'use client'

import { ArrowUpIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <Button
      type="button"
      size="icon-lg"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed right-6 bottom-6 z-50 size-10 rounded-full shadow-lg"
      aria-label="Voltar ao topo"
    >
      <ArrowUpIcon className="size-5" />
    </Button>
  )
}
