'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function BackLink() {
  const searchParams = useSearchParams()
  const raw = searchParams.get('from') ?? ''
  const from = raw.startsWith('/') ? raw : '/concursos'

  return (
    <Link
      href={from}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
    >
      <ChevronLeft className="h-4 w-4" />
      Voltar
    </Link>
  )
}
