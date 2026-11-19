import { PageSection } from '@/components/PageSection'
import { SectionHeader } from '@/components/SectionHeader'

export function Quote() {
  return (
    <PageSection id="historia" tone="paper" className="scroll-mt-20">
      <SectionHeader label="Minha história" className="mb-10 md:mb-14" />

      <figure className="flex flex-col gap-8 md:flex-row md:items-start md:gap-8">
        <span
          aria-hidden
          className="text-accent-brand font-display flex-shrink-0 text-[10rem] leading-[0.75] font-extrabold tracking-[-0.05em] md:text-[15rem]"
        >
          “
        </span>
        <div className="flex flex-1 flex-col gap-8 pt-4 md:pt-6">
          <blockquote className="text-foreground font-display max-w-4xl text-[2.25rem] leading-[1.08] font-medium tracking-[-0.025em] md:text-[3rem] lg:text-[3.5rem]">
            Eu cansei de estudar no escuro. Quero saber exatamente o que estudar, quando estudar, e
            se tô no caminho certo.
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <span aria-hidden className="bg-muted-foreground h-px w-8" />
            <cite className="text-eyebrow text-muted-foreground not-italic">
              Todo concurseiro, em algum momento
            </cite>
          </figcaption>
        </div>
      </figure>
    </PageSection>
  )
}
