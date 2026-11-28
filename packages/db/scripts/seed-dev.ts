import { requireEnv } from '@cbrl/env'
import {
  closeGabarDb,
  getGabarDb,
  resetWebContract,
  seedExam,
  truncateGabarTables,
} from '@gabar/db/pg'
import type { BrazilianRegion, ExamStatus } from '@gabar/shared'

/**
 * Local/E2E fixture data: rebuilds the `web` contract, wipes and repopulates a LOCAL database with
 * a handful of exams spread across regions, boards and statuses. Refuses any
 * non-local host so it can never truncate Supabase.
 */

const url = new URL(requireEnv('GABAR_DATABASE_URL'))
if (!['localhost', '127.0.0.1', 'postgres'].includes(url.hostname)) {
  throw new Error(`seed-dev refuses non-local database host: ${url.hostname}`)
}

interface Fixture {
  slug: string
  name: string
  board: string
  institution: string
  state: string
  city: string
  region: BrazilianRegion
  status: ExamStatus
  salary: number
  vacancies: number
  level: string
  daysToClose: number
}

const FIXTURES: Fixture[] = [
  {
    slug: 'tj-sp-escrevente-2026',
    name: 'TJ-SP Escrevente Técnico Judiciário',
    board: 'VUNESP',
    institution: 'Tribunal de Justiça de SP',
    state: 'SP',
    city: 'São Paulo',
    region: 'Southeast',
    status: 'open',
    salary: 6043,
    vacancies: 420,
    level: 'Médio',
    daysToClose: 20,
  },
  {
    slug: 'pf-agente-2026',
    name: 'Polícia Federal Agente',
    board: 'CEBRASPE',
    institution: 'Polícia Federal',
    state: 'DF',
    city: 'Brasília',
    region: 'Central-West',
    status: 'open',
    salary: 14164,
    vacancies: 630,
    level: 'Superior',
    daysToClose: 35,
  },
  {
    slug: 'sefaz-ba-auditor-2026',
    name: 'SEFAZ-BA Auditor Fiscal',
    board: 'FGV',
    institution: 'Secretaria da Fazenda da Bahia',
    state: 'BA',
    city: 'Salvador',
    region: 'Northeast',
    status: 'upcoming',
    salary: 18523,
    vacancies: 80,
    level: 'Superior',
    daysToClose: 60,
  },
  {
    slug: 'trt-rs-analista-2026',
    name: 'TRT-RS Analista Judiciário',
    board: 'FCC',
    institution: 'Tribunal Regional do Trabalho 4ª Região',
    state: 'RS',
    city: 'Porto Alegre',
    region: 'South',
    status: 'open',
    salary: 13994,
    vacancies: 45,
    level: 'Superior',
    daysToClose: 12,
  },
  {
    slug: 'pm-am-soldado-2026',
    name: 'PM-AM Soldado',
    board: 'IBFC',
    institution: 'Polícia Militar do Amazonas',
    state: 'AM',
    city: 'Manaus',
    region: 'North',
    status: 'ongoing',
    salary: 4120,
    vacancies: 900,
    level: 'Médio',
    daysToClose: 5,
  },
  {
    slug: 'petrobras-tecnico-2026',
    name: 'Petrobras Técnico de Operação',
    board: 'CESGRANRIO',
    institution: 'Petrobras',
    state: 'RJ',
    city: 'Rio de Janeiro',
    region: 'Southeast',
    status: 'open',
    salary: 5878,
    vacancies: 1100,
    level: 'Médio',
    daysToClose: 25,
  },
  {
    slug: 'prefeitura-recife-professor-2025',
    name: 'Prefeitura do Recife Professor',
    board: 'FGV',
    institution: 'Prefeitura do Recife',
    state: 'PE',
    city: 'Recife',
    region: 'Northeast',
    status: 'closed',
    salary: 3800,
    vacancies: 300,
    level: 'Superior',
    daysToClose: -40,
  },
]

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 86_400_000)
}

async function main(): Promise<void> {
  await resetWebContract()
  const db = getGabarDb()
  await truncateGabarTables(db)

  for (const [i, f] of FIXTURES.entries()) {
    await seedExam(db, {
      exam: {
        slug: f.slug,
        name: f.name,
        examiningBoard: f.board,
        institution: f.institution,
        state: f.state,
        city: f.city,
        region: f.region,
        status: f.status,
        vacancies: f.vacancies,
        salaryLowerBound: f.salary,
        scrapedAt: daysFromNow(-i),
        registrationStart: daysFromNow(f.daysToClose - 30),
        registrationEnd: daysFromNow(f.daysToClose),
        examDate: daysFromNow(f.daysToClose + 45)
          .toISOString()
          .slice(0, 10),
        registrationUrl: `https://example.com/${f.slug}/inscricao`,
        sourceUrl: `https://example.com/${f.slug}`,
      },
      positions: [
        {
          title: `Cargo principal — ${f.level}`,
          level: f.level,
          salary: f.salary,
          vacancies: f.vacancies,
        },
      ],
      documents: [
        {
          slug: 'edital',
          title: 'Edital de abertura',
          url: `https://example.com/${f.slug}/edital.pdf`,
          date: daysFromNow(f.daysToClose - 31)
            .toISOString()
            .slice(0, 10),
          type: 'notice',
          content: {
            markdown: `# ${f.name}\n\n## Inscrições\n\nVagas: ${f.vacancies}. Remuneração inicial: R$ ${f.salary}.`,
            extractedAt: new Date(),
            modelVersion: 'seed-dev',
          },
        },
      ],
    })
  }
  console.log(
    `seed-dev: ${FIXTURES.length} exams seeded into ${url.hostname}:${url.port}${url.pathname}`,
  )
}

try {
  await main()
} finally {
  await closeGabarDb()
}
