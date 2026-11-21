import StatusBadge from '@/components/StatusBadge'
import { getAllExamSlugs, getExamBySlug } from '@/lib/exams-api'
import { Skeleton } from '@cbrl/design'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import BackLink from './_components/BackLink'
import Documents from './_components/Documents'
import Header from './_components/Header'
import Info from './_components/Info'
import Positions from './_components/Positions'
import ShareButton from './_components/ShareButton'

function BackLinkFallback() {
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
      <ChevronLeft className="h-4 w-4" />
      Voltar
    </span>
  )
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const exam = await getExamBySlug(slug)
  if (!exam) return {}
  return {
    title: exam.name,
    description: `${exam.positions?.map((p) => p.title).join(', ') || 'Concurso'} | ${exam.vacancies ?? '?'} vagas | ${exam.examiningBoard}`,
    openGraph: {
      title: exam.name,
      description: `${exam.positions?.map((p) => p.title).join(', ') || 'Concurso'} | ${exam.vacancies ?? '?'} vagas | ${exam.examiningBoard}`,
      url: `https://gabar.com.br/concursos/${slug}`,
      siteName: 'Gabar',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: exam.name }],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllExamSlugs()
  if (slugs.length === 0) return [{ slug: '_placeholder_' }]
  return slugs.map((slug) => ({ slug }))
}

async function ExamContent({ params }: PageProps) {
  const { slug } = await params
  const exam = await getExamBySlug(slug)

  if (!exam) {
    notFound()
  }

  return (
    <>
      <nav aria-label="Navegação de volta" className="mb-6 flex items-center justify-between">
        <Suspense fallback={<BackLinkFallback />}>
          <BackLink />
        </Suspense>
        <div className="flex items-center gap-2">
          {process.env.NODE_ENV === 'development' && exam.sourceUrl && (
            <a
              href={exam.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-yellow-200 px-2 py-0.5 text-xs font-medium text-yellow-900 transition-colors hover:bg-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-200 dark:hover:bg-yellow-900/60"
            >
              [DEV] Ver fonte
            </a>
          )}
          <div className="flex items-center gap-2 sm:hidden">
            {exam.status && <StatusBadge status={exam.status} />}
            <ShareButton examName={exam.name} />
          </div>
        </div>
      </nav>

      <div className="flex flex-col gap-8">
        <Header exam={exam} />
        <Info exam={exam} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <aside className="lg:col-start-3 lg:row-span-2 lg:row-start-1">
            <Documents exam={exam} examSlug={slug} />
          </aside>
          <div className="lg:col-span-2">
            <Positions exam={exam} />
          </div>
        </div>
      </div>
    </>
  )
}

function ExamContentSkeleton() {
  return (
    <>
      <nav className="mb-6 flex items-center justify-between">
        <BackLinkFallback />
        <div className="flex items-center gap-2 sm:hidden">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-10" />
        </div>
      </nav>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-8 w-2/3 sm:h-9" />
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-40 rounded-lg" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-lg lg:col-span-2" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg lg:col-span-2" />
        </div>
      </div>
    </>
  )
}

export default function DetailPage({ params }: PageProps) {
  return (
    <main className="mx-auto mt-16 w-full max-w-6xl flex-1 px-4 pt-5 pb-10 sm:px-6 sm:pt-10 lg:px-8">
      <Suspense fallback={<ExamContentSkeleton />}>
        <ExamContent params={params} />
      </Suspense>
    </main>
  )
}
