import { PageSection } from '@/components/PageSection'
import { SectionHeader } from '@/components/SectionHeader'
import { PainCard } from '@/components/landing/PainCard'

const pain = [
  {
    index: 'a.',
    title: 'Editais espalhados',
    description: 'Dezenas de sites oficiais, cada um com um padrão diferente. Ninguém centraliza.',
  },
  {
    index: 'b.',
    title: 'Plano abandonado',
    description: 'Cronograma pronto vira cronograma ignorado na primeira semana atípica.',
  },
  {
    index: 'c.',
    title: 'Estudo no escuro',
    description:
      'Você não sabe o que sabe. Nem o que falta. Revisa o que já domina, evita o resto.',
  },
]

export function Problem() {
  return (
    <PageSection id="problema" tone="paper" divide className="scroll-mt-20">
      <SectionHeader label="O problema" />

      <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-24">
        <h2 className="text-h1 text-foreground max-w-3xl flex-1">
          Estudar para concurso hoje é um caos logístico.
        </h2>
        <div className="flex max-w-md flex-col gap-7 pt-2 lg:w-[26rem]">
          <p className="text-lede text-foreground">
            Você abre dez abas, cola três PDFs num drive, cria uma planilha que ninguém mais entende
            e, ainda assim, sente que está estudando pelo edital errado.
          </p>
          <p className="text-lede text-muted-foreground">
            Cada semana nova é uma reconfiguração. Cada concurso, uma aposta. O tempo some em
            decidir o que estudar — não em estudar.
          </p>
          <p className="text-lede text-foreground font-medium">
            O Gabar existe para tirar essa carga das suas costas.
          </p>
        </div>
      </div>

      <div className="border-border mt-24 grid grid-cols-1 border-t md:grid-cols-3">
        {pain.map((item, i) => (
          <PainCard
            key={item.title}
            index={item.index}
            title={item.title}
            description={item.description}
            className={
              (i < 2 ? 'border-border border-b md:border-r md:border-b-0 md:pr-8' : '') +
              (i > 0 ? ' md:pl-8' : '') +
              (i === 1 ? ' md:pr-8' : '')
            }
          />
        ))}
      </div>
    </PageSection>
  )
}
