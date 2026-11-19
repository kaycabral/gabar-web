import { PageContainer } from '@/components/PageContainer'
import { PageShell } from '@/components/PageShell'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getCategoriesStats,
  getExamCountsByBoard,
  getExamCountsByRegion,
  getExaminingBoards,
  getExamsByBoard,
  getExamsByRegion,
} from '@/lib/exams-api'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import CategoriesShell from './_components/CategoriesShell'

export const metadata: Metadata = {
  title: 'Categorias',
  description: 'Concursos públicos por região e banca organizadora.',
}

async function CategoriesContent() {
  const [examiningBoards, examsByRegion, totalsByRegion, stats] = await Promise.all([
    getExaminingBoards(),
    getExamsByRegion(),
    getExamCountsByRegion(),
    getCategoriesStats(),
  ])

  const [examsByBoard, totalsByBoard] = await Promise.all([
    getExamsByBoard(examiningBoards),
    getExamCountsByBoard(examiningBoards),
  ])

  return (
    <CategoriesShell
      examsByRegion={examsByRegion}
      examsByBoard={examsByBoard}
      totalsByRegion={totalsByRegion}
      totalsByBoard={totalsByBoard}
      boards={examiningBoards}
      stats={stats}
    />
  )
}

function CategoriesSkeleton() {
  return (
    <PageShell>
      <PageContainer className="pt-4 pb-6 sm:pt-10 sm:pb-8 md:pt-12">
        <div className="flex flex-col gap-12 sm:gap-14">
          <Skeleton className="h-4 w-40" />
          <div className="flex flex-col gap-5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-20 w-full max-w-md" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      </PageContainer>
      <PageContainer className="flex flex-col gap-20 py-12 sm:gap-24 sm:py-16 lg:gap-28 lg:py-20">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-8">
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-10 w-full max-w-2xl" />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, j) => (
                <li key={j}>
                  <Skeleton className="h-72 w-full rounded-2xl" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </PageContainer>
    </PageShell>
  )
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesContent />
    </Suspense>
  )
}
