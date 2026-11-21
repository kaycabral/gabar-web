'use client'

import { useEffect, useState } from 'react'

interface SyncIndicatorProps {
  lastSyncAt: string | null
}

export function SyncIndicator({ lastSyncAt }: SyncIndicatorProps) {
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    function compute(): string {
      if (!lastSyncAt) return 'há instantes'
      const then = new Date(lastSyncAt).getTime()
      if (Number.isNaN(then)) return 'há instantes'
      const diffMin = Math.max(1, Math.round((new Date().valueOf() - then) / 60000))
      if (diffMin < 60) return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`
      const diffHours = Math.round(diffMin / 60)
      if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
      const diffDays = Math.round(diffHours / 24)
      return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`
    }

    setLabel(compute())
    const id = window.setInterval(() => setLabel(compute()), 60_000)
    return () => window.clearInterval(id)
  }, [lastSyncAt])

  return (
    <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
      <span className="text-muted-foreground font-mono text-[11px] tracking-[0.14em] uppercase">
        Atualizado agora
      </span>
      <span className="text-foreground inline-flex items-center gap-2 text-sm">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[oklch(0.55_0.16_145)]" />
        {label ? `Sincronizado ${label}` : 'Sincronizando…'}
      </span>
    </div>
  )
}
