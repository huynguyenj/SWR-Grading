import type { PaperSetStatus } from "../types/exam_material.type";

const config: Record<PaperSetStatus, { label: string; className: string }> = {
  "0": { label: 'Đang duyệt', className: 'bg-bg-muted text-text-secondary' },
  "1": { label: 'Sẵn sàng', className: 'bg-success/10 text-success' },
  "2": { label: 'Đã sử dụng', className: 'bg-bg-muted text-text-secondary' },
  "3": { label: 'Đã lưu', className: 'bg-text-muted/10 text-text-muted' },
  "4": { label: 'Thất bại', className: 'bg-[#FF5B5B] text-text-muted' },
}

export default function PaperSetStatusBadge({ status }: { status: PaperSetStatus}) {
  const c = config[status] ?? config[0]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}