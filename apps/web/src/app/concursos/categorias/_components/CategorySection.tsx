'use client'

import { Eyebrow } from '@/components/Eyebrow'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { Exam } from '@gabar/shared'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { useCallback, useId, useRef, useState } from 'react'
import Card from '../../_components/Card'

export interface CategoryTab {
  value: string
  label: string
  seeAllLabel: string
}

interface CategorySectionProps {
  index: string
  eyebrow: string
  heading: string
  description: string
  tabs: CategoryTab[]
  examsByTab: Record<string, Exam[]>
  totalsByTab?: Record<string, number>
  filterParam: 'region' | 'board'
  seeAllPrefix: string
  emptyMessage: string
}

export default function CategorySection({
  index,
  eyebrow,
  heading,
  description,
  tabs,
  examsByTab,
  totalsByTab,
  filterParam,
  seeAllPrefix,
  emptyMessage,
}: CategorySectionProps) {
  const headingId = useId()
  const firstNonEmpty =
    tabs.find((t) => (examsByTab[t.value]?.length ?? 0) > 0)?.value ?? tabs[0]?.value
  const [active, setActive] = useState(firstNonEmpty)
  const listRef = useRef<HTMLDivElement>(null)

  const handleValueChange = useCallback((value: string) => {
    setActive(value)
    const list = listRef.current
    if (!list) return
    const trigger = list.querySelector(`[data-value="${value}"]`) as HTMLElement | null
    if (!trigger) return
    const listRect = list.getBoundingClientRect()
    const tRect = trigger.getBoundingClientRect()
    const scrollTarget = trigger.offsetLeft - listRect.width / 2 + tRect.width / 2
    list.scrollTo({ left: scrollTarget, behavior: 'smooth' })
  }, [])

  if (!firstNonEmpty) return null

  const activeTab = tabs.find((t) => t.value === active) ?? tabs[0]
  if (!activeTab) return null
  const seeAllHref = `/concursos?${filterParam}=${encodeURIComponent(activeTab.value)}`
  const hasManyTabs = tabs.length > 4

  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-col gap-8 sm:gap-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
          <h2
            id={headingId}
            className="font-display text-foreground text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.04] font-bold tracking-[-0.028em]"
          >
            {heading}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-[320px] text-sm leading-relaxed">{description}</p>
      </header>

      <Tabs value={active} onValueChange={handleValueChange}>
        <div className="border-border flex items-end justify-between gap-4 border-b">
          <TabsPrimitive.List
            ref={listRef}
            className={cn(
              '-mb-px flex max-w-full touch-pan-x scrollbar-none overflow-x-auto overflow-y-hidden overscroll-x-contain',
              hasManyTabs &&
                '[mask-image:linear-gradient(to_right,transparent,black_0.75rem,black_calc(100%-0.75rem),transparent)]',
            )}
          >
            {tabs.map((tab) => {
              const total = totalsByTab?.[tab.value]
              return (
                <TabsPrimitive.Trigger
                  key={tab.value}
                  value={tab.value}
                  data-value={tab.value}
                  className={cn(
                    'group/tab focus-visible:ring-ring relative flex shrink-0 items-center gap-2 px-4 py-3.5 sm:px-5',
                    'text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2',
                    'text-muted-foreground hover:text-foreground/80',
                    'data-[state=active]:text-foreground',
                  )}
                >
                  <span>{tab.label}</span>
                  {total != null ? (
                    <span className="text-muted-foreground/80 group-data-[state=active]/tab:text-muted-foreground font-mono text-[11px] tracking-[0.06em] tabular-nums">
                      {total}
                    </span>
                  ) : null}
                  <span
                    aria-hidden
                    className="bg-foreground absolute inset-x-0 -bottom-px h-[2px] origin-center scale-x-0 transition-transform group-data-[state=active]/tab:scale-x-100"
                  />
                </TabsPrimitive.Trigger>
              )
            })}
          </TabsPrimitive.List>

          <Link
            href={seeAllHref}
            className="text-foreground hover:text-foreground/70 hidden shrink-0 items-center gap-1.5 self-stretch py-3.5 text-sm font-medium transition-colors sm:inline-flex"
          >
            {seeAllPrefix} {activeTab.seeAllLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {tabs.map((tab) => {
          const exams = examsByTab[tab.value] ?? []
          const tabHref = `/concursos?${filterParam}=${encodeURIComponent(tab.value)}`
          const tabTotal = totalsByTab?.[tab.value]
          return (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-6 focus-visible:outline-none sm:mt-8"
            >
              {exams.length === 0 ? (
                <p className="text-muted-foreground py-12 text-center text-sm">{emptyMessage}</p>
              ) : (
                <>
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {exams.slice(0, 6).map((exam, index) => (
                      <li key={exam.id} className={cn('flex', index >= 3 && 'hidden sm:flex')}>
                        <Card exam={exam} from="/concursos/categorias" />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex items-center justify-between gap-4 sm:hidden">
                    <Link
                      href={tabHref}
                      className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium"
                    >
                      {seeAllPrefix} {tab.seeAllLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    {tabTotal != null ? (
                      <span className="text-muted-foreground font-mono text-[11px] tracking-[0.08em] uppercase">
                        {tabTotal} concursos
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </section>
  )
}
