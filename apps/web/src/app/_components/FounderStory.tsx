import { PageSection } from '@/components/PageSection'
import { SectionHeader } from '@/components/SectionHeader'
import Image from 'next/image'

export function FounderStory() {
  return (
    <PageSection id="fundador" tone="sand" divide className="scroll-mt-20">
      <SectionHeader label="Carta do fundador" meta="Manaus · abr · 2026" />

      <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
        <div className="flex w-full flex-col gap-5 lg:w-[22rem] lg:flex-shrink-0">
          <div className="bg-foreground relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="https://0.gravatar.com/avatar/d4691b19560ce36410d3fc54e8208855dfcee1550c07d49e64cfd6052780a669?s=640"
              alt="Kayron Cabral"
              fill
              sizes="(min-width: 1024px) 22rem, 100vw"
              className="object-cover opacity-90 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
            <span className="font-display text-background absolute bottom-6 left-6 text-[6rem] leading-none font-extrabold tracking-[-0.04em]">
              KC
            </span>
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <span className="text-foreground text-[0.9375rem] font-semibold">Kayron Cabral</span>
            <span className="text-meta text-muted-foreground">Fundador · Eng. de software</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-8 pt-1">
          <h2 className="text-h1 text-foreground max-w-3xl">Por que eu criei o Gabar?</h2>
          <p className="text-foreground text-[1.1875rem] leading-[1.7] tracking-[-0.005em]">
            Fui movido por um problema real esperando por uma solução tecnológica. Quando olhei pra
            o mercado de concursos públicos — milhões estudando às cegas, sem orientação, sem
            tecnologia de verdade — vi uma oportunidade enorme, e não consegui ignorar.
          </p>
          <p className="text-muted-foreground text-[1.1875rem] leading-[1.7] tracking-[-0.005em]">
            O Gabar nasceu da interseção de três coisas: minha paixão em resolver problemas com
            tecnologia, uma abertura real no mercado e a vontade de ajudar milhares de concurseiros
            a estudar com mais inteligência.
          </p>
          <p className="text-foreground text-[1.1875rem] leading-[1.7] font-medium tracking-[-0.005em]">
            Existe um lugar onde tecnologia pode mudar vidas de verdade. É aqui.
          </p>
        </div>
      </div>
    </PageSection>
  )
}
