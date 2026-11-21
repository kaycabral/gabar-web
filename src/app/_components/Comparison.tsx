import { PageSection } from '@/components/PageSection'
import { SectionHeader } from '@/components/SectionHeader'

type Cell = boolean
type GabarCell = 'available' | 'soon'
interface Row {
  feature: string
  cells: [Cell, Cell, Cell]
  gabar: GabarCell
}

const rows: Row[] = [
  { feature: 'Radar de concursos', cells: [false, false, false], gabar: 'available' },
  { feature: 'Match de perfil com IA', cells: [false, false, false], gabar: 'soon' },
  { feature: 'Plano de estudo adaptativo', cells: [false, false, false], gabar: 'soon' },
  { feature: 'Banco de questões', cells: [true, true, false], gabar: 'soon' },
  { feature: 'Análise de banca', cells: [false, true, false], gabar: 'soon' },
  { feature: 'Acompanhamento real', cells: [false, false, false], gabar: 'soon' },
  { feature: 'Central de notícias filtrada', cells: [false, false, false], gabar: 'soon' },
]

const columns = ['App de questões', 'Cursinho', 'Planilha']

export function Comparison() {
  return (
    <PageSection id="comparativo" tone="paper" className="scroll-mt-20">
      <SectionHeader label="Comparativo" meta="Gabar vs. alternativas" />

      <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2 className="text-display text-foreground max-w-4xl">
          Tudo que os outros têm. E o que só o Gabar oferece.
        </h2>
        <p className="text-muted-foreground max-w-xs pb-2 text-[1.0625rem] leading-relaxed">
          Ferramentas soltas resolvem pedaços. O Gabar é o único que conecta todos.
        </p>
      </div>

      <div className="-mx-6 mt-24 overflow-x-auto px-6 sm:-mx-10 sm:px-10 lg:-mx-14 lg:px-14">
        <div className="border-foreground min-w-[640px] border-t md:min-w-0">
          <div className="border-foreground grid grid-cols-[minmax(14rem,2fr)_1fr_1fr_1fr_1fr] items-center gap-4 border-b py-5">
            <span className="text-eyebrow text-foreground">Funcionalidade</span>
            {columns.map((col) => (
              <span key={col} className="text-eyebrow text-muted-foreground text-center">
                {col}
              </span>
            ))}
            <span className="bg-background text-eyebrow text-accent-brand sticky right-0 -mr-6 block py-1 pr-6 text-right sm:-mr-10 sm:pr-10 md:static md:m-0 md:p-0 md:text-center lg:-mr-14 lg:pr-14">
              Gabar
            </span>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={
                'grid grid-cols-[minmax(14rem,2fr)_1fr_1fr_1fr_1fr] items-center gap-4 py-6 ' +
                (i < rows.length - 1 ? 'border-border border-b' : 'border-foreground border-b')
              }
            >
              <span className="text-foreground text-[1rem] font-medium md:text-[1.0625rem]">
                {row.feature}
              </span>
              {row.cells.map((cell, idx) => (
                <span
                  key={idx}
                  className={
                    'text-center ' +
                    (cell
                      ? 'text-foreground font-display text-[1.25rem] font-bold'
                      : 'text-border text-[1.125rem]')
                  }
                >
                  {cell ? '✓' : '—'}
                </span>
              ))}
              <span className="bg-background sticky right-0 -mr-6 block pr-6 text-right sm:-mr-10 sm:pr-10 md:static md:m-0 md:p-0 md:text-center lg:-mr-14 lg:pr-14">
                {row.gabar === 'available' ? (
                  <span className="text-accent-brand font-display text-[1.25rem] font-bold">✓</span>
                ) : (
                  <span className="text-eyebrow text-accent-brand/70">Em breve</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageSection>
  )
}
