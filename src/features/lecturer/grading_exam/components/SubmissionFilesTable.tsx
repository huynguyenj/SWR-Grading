import { FiFile, FiEye } from 'react-icons/fi'
import FolderGradingStatusBadge from './FolderGradingStatusBadge'
import type { SubmissionFolder } from '../types/grading-exam.type'

interface SubmissionFilesTableProps {
  folders: SubmissionFolder[]
  onView: (folder: SubmissionFolder) => void
}

export default function SubmissionFilesTable({ folders, onView }: SubmissionFilesTableProps) {
  if (folders.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">
          Chưa có bài làm nào. Upload file bài nộp để bắt đầu.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">File bài làm</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Dung lượng</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Điểm</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((folder) => {
            const isZero = folder.status === 'graded' && folder.score === 0
            return (
              <tr
                key={folder.id}
                className={[
                  'border-b border-border-default last:border-0 transition-colors',
                  isZero ? 'bg-danger/5 hover:bg-danger/10' : 'hover:bg-bg-muted/40',
                ].join(' ')}
              >
                <td className="px-4 py-3 font-medium text-text-primary">
                  <div className="flex items-center gap-2">
                    <FiFile className="w-4 h-4 text-text-muted shrink-0" />
                    {folder.fileName}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{folder.fileSizeLabel}</td>
                <td className="px-4 py-3">
                  <FolderGradingStatusBadge status={folder.status} />
                </td>
                <td className="px-4 py-3">
                  {folder.status === 'graded' ? (
                    <span
                      className={[
                        'inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold',
                        isZero ? 'bg-danger/10 text-danger' : 'text-text-primary',
                      ].join(' ')}
                    >
                      {folder.score?.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onView(folder)}
                    disabled={folder.status !== 'graded'}
                    className="rounded-md p-1.5 text-text-muted enabled:hover:bg-bg-muted enabled:hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Xem chi tiết chấm điểm"
                    title={folder.status !== 'graded' ? 'Chưa chấm điểm' : 'Xem chi tiết'}
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}