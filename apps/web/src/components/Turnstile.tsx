'use client'

import { useEffect, useRef } from 'react'

// Cloudflare Turnstile widget. Carrega script CF lazy, monta widget no
// elemento, dispara onVerify quando token chega.
//
// Comportamento opcional:
// - sitekey ausente (env não setada) → componente não renderiza nada e dispara
//   onVerify('skipped') no mount. Permite dev local sem conta CF.
//
// SiteKeys de teste (docs Cloudflare):
//   1x00000000000000000000AA — sempre passa (use em E2E)
//   2x00000000000000000000AB — sempre falha
//   3x00000000000000000000FF — força challenge interativo

type TurnstileProps = {
  sitekey?: string
  onVerify: (token: string) => void
  theme?: 'light' | 'dark' | 'auto'
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback: (token: string) => void
          theme?: 'light' | 'dark' | 'auto'
        },
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

export function Turnstile({ sitekey, onVerify, theme = 'auto' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!sitekey) {
      // Dev sem CF: pula widget, sinaliza ok pra que o submit não fique bloqueado
      onVerify('skipped')
      return
    }

    const container = containerRef.current
    if (!container) return

    let cancelled = false

    function mount() {
      if (cancelled || !window.turnstile || !container || !sitekey) return
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey,
        callback: onVerify,
        theme,
      })
    }

    if (window.turnstile) {
      mount()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (existing) {
        existing.addEventListener('load', mount, { once: true })
      } else {
        const script = document.createElement('script')
        script.src = SCRIPT_SRC
        script.async = true
        script.defer = true
        script.addEventListener('load', mount, { once: true })
        document.head.appendChild(script)
      }
    }

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // already gone
        }
        widgetIdRef.current = null
      }
    }
  }, [sitekey, onVerify, theme])

  if (!sitekey) return null

  return <div ref={containerRef} className="cf-turnstile" />
}
