const MONTHS_SHORT = [
  'jan.',
  'fev.',
  'mar.',
  'abr.',
  'mai.',
  'jun.',
  'jul.',
  'ago.',
  'set.',
  'out.',
  'nov.',
  'dez.',
]

/**
 * Extrai a parte de data (YYYY-MM-DD) de uma string ISO 8601.
 * Funciona tanto para datas puras ("2026-05-15") quanto para datetimes
 * com fuso ("2026-05-15T09:00:00-03:00").
 */
function getDatePart(isoStr: string): string {
  return isoStr.split('T')[0] ?? isoStr
}

/**
 * Extrai o horário (HH:mm) de uma string ISO 8601 datetime.
 * Retorna null se a string não contiver horário.
 * O horário é retornado como escrito no documento (sem conversão de fuso).
 */
function getTimePart(isoStr: string): string | null {
  const tIndex = isoStr.indexOf('T')
  if (tIndex === -1) return null
  const afterT = isoStr.slice(tIndex + 1)
  const [hours, minutes] = afterT.split(':')
  if (!hours || !minutes) return null
  return `${hours}:${minutes}`
}

/** "15 mai. 2026" — formato curto para cards e listagens */
export function formatDeadline(isoDate: string | null): string {
  if (!isoDate) return '–'
  const [year, month, day] = getDatePart(isoDate).split('-')
  if (!year || !month || !day) return '–'
  return `${parseInt(day)} ${MONTHS_SHORT[parseInt(month) - 1]} ${year}`
}

/** "15/05/2026" — formato curto DD/MM/YYYY */
export function formatShortDate(isoDate: string | null): string {
  if (!isoDate) return '–'
  const [year, month, day] = getDatePart(isoDate).split('-')
  if (!year || !month || !day) return '–'
  return `${day}/${month}/${year}`
}

/** "17/03/26" ou "17/03/26, 09:00" — formato curto com ano de 2 dígitos, com horário se presente */
function formatShortDateYY(isoDate: string): string {
  const datePart = getDatePart(isoDate)
  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return isoDate
  const yy = year.slice(2)
  const time = getTimePart(isoDate)
  return time ? `${day}/${month}/${yy}, ${time}` : `${day}/${month}/${yy}`
}

/** "17/03/26" — formato curto com ano de 2 dígitos, sempre sem horário */
export function formatShortDateYYNoTime(isoDate: string | null | undefined): string {
  if (!isoDate) return '–'
  const datePart = getDatePart(isoDate)
  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) return '–'
  return `${day}/${month}/${year.slice(2)}`
}

/**
 * Formata o período de inscrição como "DD/MM/YY – DD/MM/YY" (ano 2 dígitos).
 * Com `includeTime: true`, inclui horário quando presente: "DD/MM/YY, HH:mm – DD/MM/YY, HH:mm".
 * Por padrão, omite horário (ideal para listagens).
 * Casos parciais: só end → "até DD/MM/YY"; só start → "a partir de DD/MM/YY"; nenhum → "–".
 */
export function formatRegistrationPeriod(
  start: string | null | undefined,
  end: string | null | undefined,
  options?: { includeTime?: boolean },
): string {
  const fmt = (iso: string) =>
    options?.includeTime ? formatShortDateYY(iso) : formatShortDateYYNoTime(iso)
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  if (end) return `até ${fmt(end)}`
  if (start) return `a partir de ${fmt(start)}`
  return '–'
}

/** "15 de maio de 2026" ou "15 de maio de 2026, às 09:00" quando há horário explícito */
export function formatFullDate(isoDate: string | null): string {
  if (!isoDate) return '–'
  const datePart = getDatePart(isoDate)
  const [year, month, day] = datePart.split('-').map(Number)
  if (year === undefined || month === undefined || day === undefined) return '–'
  const date = new Date(Date.UTC(year, month - 1, day))
  const formatted = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const time = getTimePart(isoDate)
  return time ? `${formatted}, às ${time}` : formatted
}
