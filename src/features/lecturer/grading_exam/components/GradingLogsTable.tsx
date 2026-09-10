import { FiCalendar, FiFolder, FiArrowRight } from 'react-icons/fi'
import GradingLogStatusBadge from './GradingLogStatusBadge'
import type { GradingLog } from '../types/grading-exam.type'

interface GradingLogsTableProps {
  logs: GradingLog[]
  onOpen: (log: GradingLog) => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function GradingLogsTable({ logs, onOpen }: GradingLogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Chưa có nhật ký chấm điểm nào.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">Nhật ký</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Đợt thi liên quan</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Ngày tạo</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Số bài đã nộp</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors cursor-pointer"
              onClick={() => onOpen(log)}
            >
              <td className="px-4 py-3 font-medium text-text-primary">{log.name}</td>
              <td className="px-4 py-3 text-text-secondary">{log.examSessionName ?? '—'}</td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                  {formatDate(log.createdAt)}
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiFolder className="w-3.5 h-3.5 text-text-muted" />
                  {log.folders.length}
                </div>
              </td>
              <td className="px-4 py-3">
                <GradingLogStatusBadge status={log.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpen(log)
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:text-brand-rust transition-colors"
                >
                  Mở
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}