'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { formatSalary } from '@/lib/salary'
import type { Exam } from '@/shared'
import { Badge, Button, Card, CardContent, Input, Pagination } from '@cbrl/design'
import { useState } from 'react'

const PAGE_SIZE = 8

const PAGINATION_LABELS = {
  root: 'Paginação de cargos',
  previous: 'Página anterior',
  next: 'Próxima página',
  page: (page: number) => `Página ${page}`,
}

interface PositionsProps {
  exam: Exam
}

export default function Positions({ exam }: PositionsProps) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  if (!exam.positions || exam.positions.length === 0) return null

  const filtered = query.trim()
    ? exam.positions.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()))
    : exam.positions

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const slice = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSearch(value: string) {
    setQuery(value)
    setPage(0)
  }

  return (
    <section aria-labelledby="positions-heading">
      <h2 id="positions-heading" className="text-foreground mb-4 text-lg font-semibold">
        Cargos
      </h2>
      <Card>
        <CardContent>
          <Input
            type="search"
            placeholder="Buscar cargo..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-4 text-sm sm:w-1/2"
            aria-label="Buscar cargo"
          />

          {slice.length > 0 ? (
            <Accordion type="single" collapsible>
              {slice.map((position, index) => {
                const hasSubjects = position.subjects && position.subjects.length > 0
                const meta = (
                  <div className="flex shrink-0 items-center gap-2">
                    {position.level && (
                      <Badge variant="secondary" className="order-1 sm:order-2">
                        {position.level}
                      </Badge>
                    )}
                    {position.salary != null && (
                      <span className="text-muted-foreground order-2 text-sm font-normal sm:order-1">
                        {formatSalary(position.salary)}
                      </span>
                    )}
                  </div>
                )

                if (!hasSubjects) {
                  return (
                    <div
                      key={page * PAGE_SIZE + index}
                      className="flex flex-col gap-1 border-b py-4 text-sm font-medium last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                    >
                      <span>{position.title}</span>
                      {meta}
                    </div>
                  )
                }

                return (
                  <AccordionItem
                    key={page * PAGE_SIZE + index}
                    value={String(page * PAGE_SIZE + index)}
                  >
                    <AccordionTrigger>
                      <div className="flex flex-1 flex-col gap-1 pr-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <span>{position.title}</span>
                        {meta}
                      </div>
                    </AccordionTrigger>

                    {position.subjects && position.subjects.length > 0 && (
                      <AccordionContent>
                        <Accordion type="single" collapsible className="border-l pl-4">
                          {position.subjects.map((subject, si) =>
                            subject.topics.length > 0 ? (
                              <AccordionItem key={si} value={String(si)}>
                                <AccordionTrigger className="text-xs font-normal">
                                  {subject.name}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-muted-foreground text-xs">
                                    {subject.topics.join(' ')}
                                  </p>
                                </AccordionContent>
                              </AccordionItem>
                            ) : (
                              <div key={si} className="border-b py-4 text-xs last:border-b-0">
                                {subject.name}
                              </div>
                            ),
                          )}
                        </Accordion>
                      </AccordionContent>
                    )}
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-muted-foreground text-sm">Nenhum cargo encontrado.</p>
              {query && (
                <Button variant="outline" size="sm" onClick={() => handleSearch('')}>
                  Limpar busca
                </Button>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 border-t pt-4">
              <Pagination
                page={page + 1}
                pageCount={totalPages}
                onPageChange={(next) => setPage(next - 1)}
                labels={PAGINATION_LABELS}
                className="justify-end"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
