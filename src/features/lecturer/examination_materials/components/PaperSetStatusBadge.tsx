import type { PaperSetStatus } from "../types/exam_material.type";

// TODO: đối chiếu lại đúng enum status thật từ BE, đây là map tạm
const config: Record<PaperSetStatus, { label: string; className: string }> = {
  0: { label: 'Nháp', className: 'bg-bg-muted text-text-secondary' },
  1: { label: 'Đã phát hành', className: 'bg-success/10 text-success' },
  2: { label: 'Đã lưu trữ', className: 'bg-text-muted/10 text-text-muted' },
}

export default function PaperSetStatusBadge({ status }: { status: PaperSetStatus}) {
  const c = config[status] ?? config[0]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}