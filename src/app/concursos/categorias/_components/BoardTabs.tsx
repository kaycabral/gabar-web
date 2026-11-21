'use client'

import type { Exam } from '@/shared'
import CategorySection, { type CategoryTab } from './CategorySection'

interface BoardTabsProps {
  examsByBoard: Record<string, Exam[]>
  boards: string[]
  totalsByBoard?: Record<string, number>
}

export default function BoardTabs({ examsByBoard, boards, totalsByBoard }: BoardTabsProps) {
  if (boards.length === 0) return null

  const tabs: CategoryTab[] = boards.map((board) => ({
    value: board,
    label: board,
    seeAllLabel: board,
  }))

  return (
    <CategorySection
      index="02"
      eyebrow="Por banca"
      heading="Concursos por banca examinadora."
      description="Quem organiza o certame molda a prova. Filtre por banca para reconhecer o estilo antes de se inscrever."
      tabs={tabs}
      examsByTab={examsByBoard}
      totalsByTab={totalsByBoard}
      filterParam="board"
      seeAllPrefix="Ver todos da"
      emptyMessage="Nenhum concurso encontrado para esta banca."
    />
  )
}
