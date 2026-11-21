import { formatRegistrationPeriod } from '@/lib/date'
import { formatRegistrationFeeFromPositions, formatSalaryFromPositions } from '@/lib/salary'
import { Button, Card, CardContent } from '@cbrl/design'
import type { Exam } from '@gabar/shared'

interface InfoProps {
  exam: Exam
}

const ITEM_LABELS: Record<string, string> = {
  vacancies: 'Vagas',
  salary: 'Remuneração',
  registrationPeriod: 'Inscrições',
  location: 'Local',
  registrationFee: 'Taxa de inscrição',
}

export default function Info({ exam }: InfoProps) {
  const registrationFee = formatRegistrationFeeFromPositions(exam.positions)
  const items = [
    { key: 'vacancies', value: exam.vacancies?.toLocaleString('pt-BR') ?? '–' },
    { key: 'salary', value: formatSalaryFromPositions(exam.positions) },
    {
      key: 'registrationPeriod',
      value: formatRegistrationPeriod(exam.registrationStart, exam.registrationEnd, {
        includeTime: true,
      }),
    },
    ...(registrationFee !== '–' ? [{ key: 'registrationFee', value: registrationFee }] : []),
    { key: 'location', value: exam.city ? `${exam.city} – ${exam.state}` : exam.state },
  ]

  const isDev = process.env.NODE_ENV === 'development'
  const hasActions = exam.registrationUrl || (isDev && exam.noticeUrl)

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ key, value }) => (
              <div key={key} className="flex flex-col gap-0.5">
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {ITEM_LABELS[key]}
                </dt>
                <dd className="text-card-foreground text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          {hasActions && (
            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              {isDev && exam.noticeUrl && (
                <Button asChild variant="default" size="lg">
                  <a href={exam.noticeUrl} target="_blank" rel="noopener noreferrer">
                    [DEV] Acessar edital
                  </a>
                </Button>
              )}
              {exam.registrationUrl && (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={
                      exam.registrationUrl.startsWith('http')
                        ? exam.registrationUrl
                        : `https://${exam.registrationUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fazer inscrição
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
