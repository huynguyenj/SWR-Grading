import type { QuizStatus } from '../types/grading-exam.type';

const config: Record<QuizStatus, { label: string; className: string }> = {
  draft: { label: 'Nháp', className: 'bg-bg-muted text-text-secondary' },
  published: { label: 'Đã phát hành', className: 'bg-success/10 text-success' },
  archived: { label: 'Đã lưu trữ', className: 'bg-text-muted/10 text-text-muted' },
}

export default function QuizStatusBadge({ status }: { status: QuizStatus }) {
  const c = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}