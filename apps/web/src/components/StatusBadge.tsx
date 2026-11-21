import { STATUS_LABELS } from '@/lib/constants'
import { Badge } from '@cbrl/design'
import type { ExamStatus } from '@gabar/shared'

// Gabar's status palette (tokens in globals.css), layered on the base Badge.
const STATUS_CLASSES: Record<ExamStatus, string> = {
  open: 'bg-badge-open text-badge-open-fg border-transparent',
  upcoming: 'bg-badge-upcoming text-badge-upcoming-fg border-transparent',
  closed: 'bg-badge-closed text-badge-closed-fg border-transparent',
  ongoing: 'bg-badge-ongoing text-badge-ongoing-fg border-transparent',
}

interface StatusBadgeProps {
  status: ExamStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={STATUS_CLASSES[status]}>{STATUS_LABELS[status]}</Badge>
}
