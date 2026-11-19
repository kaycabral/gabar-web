'use client'

import { Logomark } from '@/components/Logomark'
import { FooterLinkColumn, type FooterLink } from '@/components/landing/FooterLinkColumn'
import { useState } from 'react'
import { WaitlistModal } from './WaitlistModal'

export function Footer() {
  const [open, setOpen] = useState(false)
  const [modalKey, setModalKey] = useState(0)

  function openWaitlist() {
    setModalKey((k) => k + 1)
    setOpen(true)
  }

  const siteMap: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Concursos',
      links: [
        { label: 'Categorias', onClick: openWaitlist },
        { label: 'Todos os concursos', onClick: openWaitlist },
        { label: 'Editais recentes', onClick: openWaitlist },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { label: 'Como funciona', href: '/#metodo' },
        { label: 'Funcionalidades', href: '/#produto' },
        { label: 'Comparativo', href: '/#comparativo' },
        { label: 'FAQ', href: '/#faq' },
      ],
    },
    {
      title: 'Sobre',
      links: [
        { label: 'Minha história', href: '/#historia' },
        { label: 'Linkedin', href: 'https://www.linkedin.com/in/kayroncabral/', external: true },
        { label: 'Contato', href: 'mailto:kayron@gabar.com.br' },
        { label: 'Privacidade', href: '/privacidade' },
        { label: 'Termos', href: '/termos' },
      ],
    },
  ]

  return (
    <>
      <footer className="border-border bg-background text-foreground border-t px-6 pt-24 pb-12 sm:px-10 lg:px-14">
        <div className="flex flex-col gap-16 pb-20 lg:flex-row lg:justify-between lg:gap-24">
          <div className="flex max-w-md flex-col gap-6">
            <Logomark size="lg" />
            <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
              A plataforma all-in-one de concursos com IA. Menos caos, mais método. Feito em Manaus
              para concurseiros de todo o Brasil.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3 lg:gap-x-24">
            {siteMap.map((section) => (
              <FooterLinkColumn key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>

        <div className="border-border flex flex-col justify-between gap-4 border-t pt-8 sm:flex-row sm:items-center">
          <p className="text-meta text-muted-foreground">
            © 2026 Gabar · Feito com{' '}
            <span className="text-accent-brand" aria-hidden>
              ♥
            </span>{' '}
            por{' '}
            <a
              href="https://www.linkedin.com/in/kayroncabral"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground underline-offset-2 transition-colors hover:underline"
            >
              Kayron Cabral
            </a>
          </p>
          <p className="text-meta text-muted-foreground">Manaus · Brasil</p>
        </div>
      </footer>
      <WaitlistModal key={modalKey} open={open} onOpenChange={setOpen} />
    </>
  )
}
