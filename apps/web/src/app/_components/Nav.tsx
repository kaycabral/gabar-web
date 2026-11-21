'use client'

import { Logomark } from '@/components/Logomark'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'
import { Button } from '@cbrl/design'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const navLinks = [
  { href: '#produto', label: 'Produto' },
  { href: '#metodo', label: 'Método' },
  { href: '#comparativo', label: 'Comparativo' },
  { href: '#historia', label: 'História' },
]

interface NavProps {
  minimal?: boolean
}

export function Nav({ minimal = false }: NavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (mobileOpen) firstLinkRef.current?.focus()
  }, [mobileOpen])

  const logoHref = minimal ? '/concursos/categorias' : '/'

  function handleLogoClick() {
    if (pathname === logoHref) window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <nav className="border-border bg-background/92 fixed top-0 right-0 left-0 z-50 flex items-center justify-between gap-6 border-b px-6 py-5 backdrop-blur-[16px] sm:px-10 lg:px-14">
        <Link
          href={logoHref}
          onClick={handleLogoClick}
          aria-label={minimal ? 'Gabar — categorias' : 'Gabar — página inicial'}
        >
          <Logomark size="sm" />
        </Link>

        {!minimal && (
          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-eyebrow text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {!minimal && (
            <Link
              href="/concursos/categorias"
              className="border-foreground bg-background text-foreground hover:bg-foreground hover:text-background hidden cursor-pointer items-center justify-between gap-2 rounded-full border px-4 py-2.5 text-[0.8125rem] font-medium tracking-[-0.01em] transition-colors sm:inline-flex"
            >
              <span>Concursos</span>
              <span aria-hidden className="text-sm">
                →
              </span>
            </Link>
          )}

          {!minimal && (
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="text-foreground/70 size-10 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-border bg-background/96 fixed inset-x-0 top-[68px] z-40 border-b px-6 py-6 backdrop-blur-[16px] lg:hidden">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-eyebrow text-foreground/80 block py-3',
                    'hover:text-foreground transition-colors',
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
