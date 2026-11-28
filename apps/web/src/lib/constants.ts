import type { BrazilianRegion, ExamStatus } from '@gabar/shared'

/** Origem canônica do site (sem barra final), usada em canonical, Open Graph e sitemap. */
export const SITE_URL = 'https://gabar.com.br'

/** Rótulos de exibição para status de concurso */
export const STATUS_LABELS: Record<ExamStatus, string> = {
  open: 'Aberto',
  upcoming: 'Em breve',
  closed: 'Encerrado',
  ongoing: 'Em andamento',
}

/** Rótulos de exibição para regiões do Brasil */
export const REGION_LABELS: Record<BrazilianRegion, string> = {
  North: 'Norte',
  Northeast: 'Nordeste',
  'Central-West': 'Centro-Oeste',
  Southeast: 'Sudeste',
  South: 'Sul',
}
