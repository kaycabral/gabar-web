'use client'

import { REGION_LABELS } from '@/lib/constants'
import type { BrazilianRegion, Exam } from '@gabar/shared'
import CategorySection, { type CategoryTab } from './CategorySection'

interface RegionTabsProps {
  examsByRegion: Record<BrazilianRegion, Exam[]>
  totalsByRegion?: Record<BrazilianRegion, number>
}

const REGIONS: BrazilianRegion[] = ['Southeast', 'Northeast', 'South', 'Central-West', 'North']

const TABS: CategoryTab[] = REGIONS.map((region) => ({
  value: region,
  label: REGION_LABELS[region],
  seeAllLabel: REGION_LABELS[region],
}))

export default function RegionTabs({ examsByRegion, totalsByRegion }: RegionTabsProps) {
  return (
    <CategorySection
      index="01"
      eyebrow="Por região"
      heading="Concursos por região do Brasil."
      description="Os mais recentes de cada região. A cobertura é atualizada em tempo real com os diários oficiais."
      tabs={TABS}
      examsByTab={examsByRegion}
      totalsByTab={totalsByRegion as Record<string, number> | undefined}
      filterParam="region"
      seeAllPrefix="Ver todos do"
      emptyMessage="Nenhum concurso encontrado nesta região."
    />
  )
}
