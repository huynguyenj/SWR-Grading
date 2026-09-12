import { FiLoader } from 'react-icons/fi'
import type { FolderGradingStatus } from '../types/grading-exam.type';

const config: Record<FolderGradingStatus, { label: string; className: string }> = {
  not_graded: { label: 'Chưa chấm', className: 'bg-bg-muted text-text-secondary' },
  grading: { label: 'Đang chấm...', className: 'bg-brand-rust/10 text-brand-rust' },
  graded: { label: 'Đã chấm', className: 'bg-success/10 text-success' },
}

export default function FolderGradingStatusBadge({ status }: { status: FolderGradingStatus }) {
  const c = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.className}`}
    >
      {status === 'grading' && <FiLoader className="w-3 h-3 animate-spin" />}
      {c.label}
    </span>
  )
}