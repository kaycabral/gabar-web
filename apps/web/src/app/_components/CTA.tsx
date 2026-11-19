import { PageSection } from '@/components/PageSection'
import { PillButton } from '@/components/PillButton'
import { SectionHeader } from '@/components/SectionHeader'

interface CTAProps {
  onOpenWaitlist: () => void
}

export function CTA({ onOpenWaitlist }: CTAProps) {
  return (
    <PageSection
      id="lista-de-espera"
      tone="ink"
      size="none"
      className="overflow-clip pt-32 pb-36 md:pt-40 md:pb-44 lg:pt-44"
    >
      <SectionHeader label="Fim · começo" meta="Lista de espera" tone="dark" />

      <h2 className="text-display-xl text-background max-w-5xl">
        A vaga é sua.
        <br />A gente leva
        <br />
        você até ela.
      </h2>

      <div className="mt-16 flex flex-col justify-between gap-10 border-t border-white/10 pt-14 lg:flex-row lg:items-end">
        <p className="text-background/65 max-w-xl text-[1.1875rem] leading-[1.6]">
          Entre na lista de espera e seja um dos primeiros a testar o Gabar. Acesso antecipado à
          beta fechada.
        </p>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <PillButton type="button" variant="accent" size="lg" onClick={onOpenWaitlist}>
            Entrar na lista de espera
          </PillButton>
          <span className="text-meta text-background/55">+ 100 pessoas já entraram</span>
        </div>
      </div>
    </PageSection>
  )
}
