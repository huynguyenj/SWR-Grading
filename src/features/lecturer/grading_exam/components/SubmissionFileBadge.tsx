import type { SubmissionStatus } from '../types/grading-exam.type'

const config: Record<SubmissionStatus, { className: string }> = {
  '0': { className: 'bg-bg-muted text-text-secondary' }, // Submitted
  '1': { className: 'bg-brand-rust/10 text-brand-rust' }, // AI_Graded
  '2': { className: 'bg-success/10 text-success' }, // Lecturer_Reviewed
  '3': { className: 'bg-text-muted/10 text-text-muted' }, // Final
}

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus
  /** Dùng luôn nhãn thật từ BE (statusName) thay vì tự dịch lại */
  statusName: string
}

export default function SubmissionStatusBadge({ status, statusName }: SubmissionStatusBadgeProps) {
  const c = config[status] ?? config['0']
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${c.className}`}>
      {statusName}
    </span>
  )
}