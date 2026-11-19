export type ExamStatus = 'open' | 'upcoming' | 'closed' | 'ongoing'

export type BrazilianRegion = 'North' | 'Northeast' | 'Central-West' | 'Southeast' | 'South'

export const BRAZIL_REGIONS: Record<BrazilianRegion, string[]> = {
  North: ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'],
  Northeast: ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
  'Central-West': ['MT', 'MS', 'GO', 'DF'],
  Southeast: ['SP', 'RJ', 'MG', 'ES'],
  South: ['PR', 'SC', 'RS'],
}

export type DocumentType = 'notice' | 'result' | 'answer-key' | 'appeal' | 'enrollment' | 'other'

export type DocumentFormat = 'file' | 'link'

export interface ExamDocument {
  slug?: string | null
  title: string
  date: string | null
  url: string
  type?: DocumentType | null
  format?: DocumentFormat | null
  hasContent?: boolean
}

export interface ExamSubject {
  name: string
  topics: string[]
}

export interface ExamPosition {
  title: string
  level: string | null
  salary: number | null
  vacancies?: number | null
  registrationFee?: number | null
  subjects?: ExamSubject[] | null
}

export interface DocumentContent {
  markdown: string
  extractedAt: string
  modelVersion: string
  truncated: boolean
}

export interface Article {
  id: number
  examId: string | null
  slug: string
  title: string
  content: string
  excerpt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Exam {
  id: string
  slug?: string | null
  name: string
  status?: ExamStatus
  examiningBoard: string
  institution: string | null
  positions: ExamPosition[] | null
  vacancies: number | null
  state: string
  city: string | null
  region: BrazilianRegion
  documents?: ExamDocument[]
  noticeUrl?: string | null
  registrationUrl?: string | null
  sourceUrl?: string | null
  scrapedAt?: string | null
  // Datas do concurso (ex-JSONB exam_dates, agora colunas nativas)
  examDate?: string | null
  resultDate?: string | null
  possessionDate?: string | null
  registrationStart?: string | null
  registrationEnd?: string | null
  enrichedAt?: string | null
}
