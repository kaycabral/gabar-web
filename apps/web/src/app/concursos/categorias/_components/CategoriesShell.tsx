import { PageContainer } from '@/components/PageContainer'
import { PageShell } from '@/components/PageShell'
import type { CategoriesStats } from '@/lib/exams-api'
import type { BrazilianRegion, Exam } from '@gabar/shared'
import { AlertsCTA } from './AlertsCTA'
import BoardTabs from './BoardTabs'
import { CategoriesHero } from './CategoriesHero'
import RegionTabs from './RegionTabs'

interface CategoriesShellProps {
  examsByRegion: Record<BrazilianRegion, Exam[]>
  examsByBoard: Record<string, Exam[]>
  totalsByRegion: Record<BrazilianRegion, number>
  totalsByBoard: Record<string, number>
  boards: string[]
  stats: CategoriesStats
}

export default function CategoriesShell({
  examsByRegion,
  examsByBoard,
  totalsByRegion,
  totalsByBoard,
  boards,
  stats,
}: CategoriesShellProps) {
  return (
    <PageShell>
      <PageContainer className="pt-4 pb-6 sm:pt-10 sm:pb-8 md:pt-12">
        <CategoriesHero stats={stats} boardsCount={boards.length} />
      </PageContainer>

      <PageContainer className="flex flex-col gap-20 py-12 sm:gap-24 sm:py-16 lg:gap-28 lg:py-20">
        <RegionTabs examsByRegion={examsByRegion} totalsByRegion={totalsByRegion} />
        <BoardTabs examsByBoard={examsByBoard} boards={boards} totalsByBoard={totalsByBoard} />
      </PageContainer>

      <PageContainer className="pb-20 sm:pb-24 lg:pb-28">
        <AlertsCTA />
      </PageContainer>
    </PageShell>
  )
}
