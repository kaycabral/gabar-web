# packages/shared

Pacote interno com os tipos TypeScript compartilhados entre `apps/web` e `apps/scraper`.

## Por que existe

Garante que o contrato de dados seja único no repo — qualquer mudança no modelo reflete automaticamente nos dois consumidores sem duplicação de tipos.

```
packages/shared  (@gabar/shared)
    ├── apps/web     (lê e exibe os dados)
    └── apps/scraper (coleta e grava os dados)
```

## Estrutura

```
src/
├── types/
│   └── exam.ts    # Todos os tipos do domínio
└── index.ts       # Re-exporta tudo
```

## Tipos exportados

```typescript
// Status de um concurso
type ExamStatus = 'open' | 'upcoming' | 'closed'

// Regiões do Brasil
type BrazilianRegion = 'North' | 'Northeast' | 'Central-West' | 'Southeast' | 'South'

// Notícia associada a um concurso
interface ExamNews {
  title: string
  publishedAt: string // "YYYY-MM-DD"
  source: string
  summary: string
  body: string
}

// Documento (edital ou prova)
type ExamDocumentType = 'edital' | 'prova'
interface ExamDocument {
  id: string
  title: string
  type: ExamDocumentType
  year: number
  url: string
}

// Concurso público
interface Exam {
  id: string
  name: string
  examiningBoard: string // banca organizadora, e.g. "FGV", "CESPE"
  institution: string // órgão contratante, e.g. "Polícia Federal"
  position: string // cargo, e.g. "Analista", "Técnico"
  vacancies: number
  salaryRange: string | null
  applicationDeadline: string | null // ISO 8601
  state: string
  city: string
  region: BrazilianRegion
  news?: ExamNews
  documents?: ExamDocument[]
  noticeUrl?: string | null // link direto ao edital
  registrationUrl?: string | null // link de inscrição
  sourceUrl?: string | null // URL canônica na banca
  scrapedAt?: string | null // ISO datetime da última raspagem
}

// Estado dos filtros na UI
interface FilterState {
  search: string
  status: ExamStatus | undefined
  salaryMin: number
  salaryMax: number
  region: BrazilianRegion | undefined
  state: string | undefined
  city: string | undefined
}
```

## Como usar

```typescript
import type { Exam, ExamStatus, FilterState } from '@gabar/shared'
```

O pacote é resolvido via pnpm workspaces — não há build step, os arquivos `.ts` são importados diretamente.
