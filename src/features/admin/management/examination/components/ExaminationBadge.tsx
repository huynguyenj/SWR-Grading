import type { ExamSessionStatus } from "../types/examination.type";

const statusConfig: Record<ExamSessionStatus, { label: string; className: string }> = {
  draft: { label: 'Nháp', className: 'bg-bg-muted text-text-secondary' },
  scheduled: { label: 'Sắp diễn ra', className: 'bg-brand-rust/10 text-brand-rust' },
  ongoing: { label: 'Đang diễn ra', className: 'bg-success/10 text-success' },
  completed: { label: 'Đã kết thúc', className: 'bg-text-muted/10 text-text-muted' },
  cancelled: { label: 'Đã hủy', className: 'bg-text-muted/10 text-text-muted' }
}

export default function ExamSessionStatusBadge({ status }: { status: ExamSessionStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}