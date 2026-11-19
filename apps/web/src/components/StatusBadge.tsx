import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS } from '@/lib/constants'
import type { ExamStatus } from '@gabar/shared'

interface StatusBadgeProps {
  status: ExamStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={status}>{STATUS_LABELS[status]}</Badge>
}
