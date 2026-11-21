'use client'

import { formatShortDate } from '@/lib/date'
import type { DocumentType, Exam, ExamDocument } from '@/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@cbrl/design'
import { ExternalLinkIcon, EyeIcon, FileTextIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useRef } from 'react'

const TYPE_LABELS: Record<DocumentType, string> = {
  notice: 'Editais',
  result: 'Resultados',
  'answer-key': 'Provas e Gabaritos',
  appeal: 'Recursos',
  enrollment: 'Inscrições',
  other: 'Outros',
}

const TYPE_ORDER: DocumentType[] = [
  'notice',
  'enrollment',
  'answer-key',
  'result',
  'appeal',
  'other',
]

interface DocumentsProps {
  exam: Exam
  examSlug: string
}

function DocumentLink({ doc, examSlug }: { doc: ExamDocument; examSlug: string }) {
  return (
    <div className="bg-card hover:bg-accent focus-within:ring-ring flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none">
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${doc.title} – ${formatShortDate(doc.date)} (abre em nova aba)`}
        className="text-card-foreground flex min-w-0 flex-1 items-center gap-2 font-medium"
      >
        {doc.format === 'link' ? (
          <ExternalLinkIcon className="text-muted-foreground h-4 w-4 shrink-0" />
        ) : (
          <FileTextIcon className="text-muted-foreground h-4 w-4 shrink-0" />
        )}
        <span className="truncate">{doc.title}</span>
      </a>
      <div className="flex shrink-0 items-center gap-2">
        {doc.hasContent && (
          <Link
            href={`/concursos/${examSlug}/documento/${doc.slug}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            aria-label={`Ver conteúdo de ${doc.title}`}
          >
            <EyeIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ver</span>
          </Link>
        )}
        <span className="text-muted-foreground text-xs">{formatShortDate(doc.date)}</span>
      </div>
    </div>
  )
}

function DocumentList({ documents, examSlug }: { documents: ExamDocument[]; examSlug: string }) {
  return (
    <div className="flex flex-col gap-2">
      {documents.map((doc) => (
        <DocumentLink key={doc.url} doc={doc} examSlug={examSlug} />
      ))}
    </div>
  )
}

function groupByType(documents: ExamDocument[]): Map<DocumentType, ExamDocument[]> {
  const groups = new Map<DocumentType, ExamDocument[]>()
  for (const doc of documents) {
    const type = doc.type ?? 'other'
    const list = groups.get(type)
    if (list) {
      list.push(doc)
    } else {
      groups.set(type, [doc])
    }
  }
  return groups
}

export default function Documents({ exam, examSlug }: DocumentsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const handleValueChange = useCallback((value: string) => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector(`[data-value="${value}"]`) as HTMLElement | null
    if (!active) return
    const listRect = list.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    const scrollTarget = active.offsetLeft - listRect.width / 2 + activeRect.width / 2
    list.scrollTo({ left: scrollTarget, behavior: 'smooth' })
  }, [])

  if (!exam.documents || exam.documents.length === 0) return null

  const groups = groupByType(exam.documents)
  const orderedTypes = TYPE_ORDER.filter((type) => groups.has(type))

  return (
    <section aria-labelledby="documents-heading">
      <h2 id="documents-heading" className="text-foreground mb-4 text-lg font-semibold">
        Arquivos e links
      </h2>
      {orderedTypes.length <= 1 ? (
        <DocumentList documents={exam.documents} examSlug={examSlug} />
      ) : (
        <Tabs defaultValue={orderedTypes[0]} onValueChange={handleValueChange} className="gap-3">
          <TabsList
            ref={listRef}
            className={`h-auto max-w-full scrollbar-none justify-start gap-1 overflow-x-auto ${
              orderedTypes.length > 3
                ? '[mask-image:linear-gradient(to_right,transparent,black_0.75rem,black_calc(100%-0.75rem),transparent)]'
                : ''
            }`}
          >
            {orderedTypes.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                data-value={type}
                className="text-muted-foreground data-[state=active]:text-foreground px-3 py-1.5"
              >
                {TYPE_LABELS[type]}
              </TabsTrigger>
            ))}
          </TabsList>
          {orderedTypes.map((type) => (
            <TabsContent key={type} value={type}>
              <DocumentList documents={groups.get(type)!} examSlug={examSlug} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  )
}
