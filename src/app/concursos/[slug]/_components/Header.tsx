import StatusBadge from '@/components/StatusBadge'
import type { Exam } from '@/shared'
import ShareButton from './ShareButton'

interface HeaderProps {
  exam: Exam
}

export default function Header({ exam }: HeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-foreground flex-1 text-2xl font-bold sm:text-3xl">{exam.name}</h1>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {exam.status && <StatusBadge status={exam.status} />}
          <ShareButton examName={exam.name} />
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{exam.examiningBoard}</p>
    </div>
  )
}
