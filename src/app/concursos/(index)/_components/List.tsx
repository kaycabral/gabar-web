import type { Exam } from '@/shared'
import Card from '../../_components/Card'
import EmptyState from './EmptyState'

interface ListProps {
  exams: Exam[]
  listingSearch?: string
  showReset?: boolean
  onReset?: () => void
}

export default function List({ exams, listingSearch, showReset, onReset }: ListProps) {
  if (exams.length === 0) {
    return <EmptyState showReset={showReset} onReset={onReset} />
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {exams.map((exam) => (
        <li key={exam.id}>
          <Card exam={exam} from={listingSearch ? `/concursos?${listingSearch}` : undefined} />
        </li>
      ))}
    </ul>
  )
}
