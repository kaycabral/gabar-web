import { ArrowRight } from 'lucide-react'

import { Button } from '@cbrl/design'

export function AlertsCTA() {
  return (
    <section
      aria-labelledby="alerts-cta-heading"
      className="bg-foreground text-background relative isolate flex flex-col gap-10 overflow-hidden rounded-3xl px-7 py-12 sm:px-12 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-16 lg:py-20"
    >
      <span
        aria-hidden
        className="bg-accent-brand/15 pointer-events-none absolute -right-24 -bottom-24 h-[380px] w-[380px] rounded-full blur-3xl"
      />

      <div className="relative flex max-w-[560px] flex-col gap-5">
        <span className="text-background/55 font-mono text-[11px] tracking-[0.16em] uppercase">
          Não encontrou o recorte?
        </span>
        <h2
          id="alerts-cta-heading"
          className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.06] font-bold tracking-[-0.028em]"
        >
          Monte sua trilha com o concurso certo.
        </h2>
        <p className="text-background/70 max-w-[520px] text-base leading-relaxed">
          Receba alertas quando surgir edital no seu recorte — por estado, banca ou área de
          interesse. Sem spam, só o que importa.
        </p>
      </div>

      <div className="relative flex flex-col items-start gap-3 lg:items-end">
        <Button
          type="button"
          size="lg"
          disabled
          className="bg-accent-brand text-accent-brand-foreground h-auto gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold tracking-[-0.01em]"
        >
          Configurar alertas
          <ArrowRight className="size-4" />
        </Button>
        <span className="text-background/55 font-mono text-xs tracking-[0.04em]">
          Grátis · 30 segundos
        </span>
      </div>
    </section>
  )
}
