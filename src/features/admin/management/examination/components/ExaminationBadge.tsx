import { EXAMINATION_STATUS_LABEL, type ExaminationStatus } from '../types/examination.type'

const statusClass: Record<ExaminationStatus, string> = {
  0: 'bg-bg-muted text-text-secondary',
  1: 'bg-success/10 text-success',
  2: 'bg-warning/10 text-warning',
  3: 'bg-text-muted/10 text-text-muted',
  4: 'bg-danger/10 text-danger',
}

export default function ExamSessionStatusBadge({ status }: { status: ExaminationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[status] ?? statusClass[0]}`}
    >
      {EXAMINATION_STATUS_LABEL[status] ?? '—'}
    </span>
  )
}