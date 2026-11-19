import { Skeleton } from '@/components/ui/skeleton'
import { getDocumentBySlug, getExamBySlug } from '@/lib/exams-api'
import { AlertTriangleIcon, ChevronLeftIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Markdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import ScrollToTop from './_components/ScrollToTop'

interface PageProps {
  params: Promise<{ slug: string; documentSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, documentSlug } = await params
  const [exam, doc] = await Promise.all([
    getExamBySlug(slug),
    getDocumentBySlug(slug, documentSlug),
  ])
  if (!exam || !doc) return {}
  return {
    title: `${doc.title} — ${exam.name}`,
    description: `${doc.title} do concurso ${exam.name} (${exam.examiningBoard})`,
    openGraph: {
      title: `${doc.title} — ${exam.name}`,
      description: `${doc.title} do concurso ${exam.name} (${exam.examiningBoard})`,
      url: `https://gabar.com.br/concursos/${slug}/documento/${documentSlug}`,
      siteName: 'Gabar',
      locale: 'pt_BR',
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  return [{ slug: '_placeholder_', documentSlug: '_placeholder_' }]
}

async function DocumentContent({ params }: PageProps) {
  const { slug, documentSlug } = await params
  const [exam, doc] = await Promise.all([
    getExamBySlug(slug),
    getDocumentBySlug(slug, documentSlug),
  ])

  if (!exam || !doc) {
    notFound()
  }

  return (
    <>
      <nav className="mb-6 flex items-center justify-between">
        <Link
          href={`/concursos/${slug}`}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 text-sm"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Voltar
        </Link>
        {process.env.NODE_ENV === 'development' && (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-yellow-200 px-2 py-0.5 text-xs font-medium text-yellow-900 hover:bg-yellow-300"
          >
            [DEV] Ver original
          </a>
        )}
      </nav>

      <header className="mb-8">
        <h1 className="text-foreground text-xl font-semibold sm:text-2xl">{doc.title}</h1>
        {doc.truncated && (
          <div className="mt-3 flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200">
            <AlertTriangleIcon className="h-3.5 w-3.5 shrink-0" />
            Este documento pode estar incompleto — o conteúdo foi truncado durante a conversão.
          </div>
        )}
      </header>

      <article className="prose prose-sm dark:prose-invert sm:prose-base prose-headings:border-b prose-headings:pb-2 prose-headings:font-bold max-w-none text-justify">
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
          {doc.markdown}
        </Markdown>
      </article>
    </>
  )
}

function DocumentSkeleton() {
  return (
    <>
      <nav className="mb-6">
        <Skeleton className="h-4 w-40" />
      </nav>
      <header className="mb-8">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="mt-2 h-3 w-48" />
      </header>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </>
  )
}

export default function DocumentPage({ params }: PageProps) {
  return (
    <main className="mx-auto mt-16 w-full max-w-4xl flex-1 px-4 pt-5 pb-10 sm:px-6 sm:pt-10 lg:px-8">
      <Suspense fallback={<DocumentSkeleton />}>
        <DocumentContent params={params} />
      </Suspense>
      <ScrollToTop />
    </main>
  )
}
