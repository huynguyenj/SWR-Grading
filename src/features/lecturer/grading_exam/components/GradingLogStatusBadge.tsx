import type { GradingLogStatus } from "../types/grading-exam.type";

const config: Record<GradingLogStatus, { label: string; className: string }> = {
  draft: { label: 'Chưa chấm', className: 'bg-bg-muted text-text-secondary' },
  in_progress: { label: 'Đang chấm', className: 'bg-brand-rust/10 text-brand-rust' },
  completed: { label: 'Đã hoàn thành', className: 'bg-success/10 text-success' },
}

export default function GradingLogStatusBadge({ status }: { status: GradingLogStatus }) {
  const c = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}