import type { SemesterStatus } from "../types/semester";

const statusConfig: Record<SemesterStatus, { label: string; className: string }> = {
  "0": { label: 'Sắp diễn ra', className: 'bg-brand-rust/10 text-brand-rust' },
  "1": { label: 'Đang diễn ra', className: 'bg-success/10 text-success' },
  "2": { label: 'Đã kết thúc', className: 'bg-text-muted/10 text-text-muted' },
}

export default function SemesterStatusBadge({ status }: { status: SemesterStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}