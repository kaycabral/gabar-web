import { PageContainer } from '@/components/PageContainer'
import { PageShell } from '@/components/PageShell'
import type { ExamFilters } from '@/lib/exams-api'
import {
  getCities,
  getExaminingBoards,
  getExamsPaginated,
  getGlobalSalaryMax,
  PAGE_SIZE,
} from '@/lib/exams-api'
import type { ExamSort } from '@/lib/filters'
import { DEFAULT_SORT } from '@/lib/filters'
import { Skeleton } from '@cbrl/design'
import type { BrazilianRegion } from '@gabar/shared'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import CardSkeleton from '../_components/CardSkeleton'
import ExamsShell from './_components/ExamsShell'

const VALID_SORTS: readonly ExamSort[] = ['recent', 'salary', 'deadline'] as const

export const metadata: Metadata = {
  title: 'Concursos',
  description: 'Lista de concursos públicos.',
}

interface PageProps {
  searchParams: Promise<Record<string, string>>
}

async function ExamListContent({ searchParams }: PageProps) {
  const params = await searchParams

  const rawSort = params.sort as string | undefined
  const sort: ExamSort =
    rawSort && (VALID_SORTS as readonly string[]).includes(rawSort)
      ? (rawSort as ExamSort)
      : DEFAULT_SORT

  const filters: ExamFilters = {
    search: params.q || undefined,
    status: (params.status as ExamFilters['status']) || undefined,
    examiningBoard: params.board || undefined,
    salaryMin: params.salaryMin ? Number(params.salaryMin) : undefined,
    salaryMax: params.salaryMax ? Number(params.salaryMax) : undefined,
    region: (params.region as BrazilianRegion) || undefined,
    state: params.state || undefined,
    city: params.city || undefined,
    sort,
  }

  const page = Math.max(1, Number(params.page) || 1)

  const [{ exams, total }, cities, examiningBoards, globalSalaryMax] = await Promise.all([
    getExamsPaginated(filters, page),
    getCities(),
    getExaminingBoards(),
    getGlobalSalaryMax(),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (total > 0 && page > totalPages) {
    const sp = new URLSearchParams(params)
    sp.set('page', String(totalPages))
    redirect(`/concursos?${sp.toString()}`)
  }

  return (
    <ExamsShell
      exams={exams}
      cities={cities}
      examiningBoards={examiningBoards}
      page={page}
      totalPages={totalPages}
      total={total}
      salaryMax={globalSalaryMax}
    />
  )
}

export default function ExamsPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <PageShell>
          <PageContainer className="pt-4 pb-6 sm:pt-10 sm:pb-8 md:pt-12">
            <div className="flex flex-col gap-8">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-16 w-full max-w-[700px]" />
              <Skeleton className="h-14 w-full" />
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <li key={i} className={i >= 6 ? 'hidden sm:block' : undefined}>
                    <CardSkeleton />
                  </li>
                ))}
              </ul>
            </div>
          </PageContainer>
        </PageShell>
      }
    >
      <ExamListContent searchParams={searchParams} />
    </Suspense>
  )
}
