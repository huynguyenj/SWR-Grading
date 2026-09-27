import { FiFile, FiEye } from 'react-icons/fi'
import type { SubmissionDetail } from '../types/grading-exam.type'
import SubmissionStatusBadge from './SubmissionFileBadge'

interface SubmissionFilesTableProps {
  submissions: SubmissionDetail[]
  onView: (submission: SubmissionDetail) => void
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <span className="text-text-muted">—</span>
  const isZero = score === 0
  return (
    <span
      className={[
        'inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold',
        isZero ? 'bg-danger/10 text-danger' : 'text-text-primary',
      ].join(' ')}
    >
      {score.toFixed(1)}
    </span>
  )
}

export default function SubmissionFilesTable({ submissions, onView }: SubmissionFilesTableProps) {
  if (submissions.length === 0) {
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
            <th className="px-4 py-3 font-medium text-text-secondary">Sinh viên</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Điểm AI</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Điểm GV</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const isZero =
              submission.aiScore === 0 || submission.lecturerScore === 0
            // Chưa có bản ghi AI chấm (status Submitted) thì chưa xem chi tiết được
            const canView = submission.status !== '0'

            return (
              <tr
                key={submission.submissionId}
                className={[
                  'border-b border-border-default last:border-0 transition-colors',
                  isZero ? 'bg-danger/5 hover:bg-danger/10' : 'hover:bg-bg-muted/40',
                ].join(' ')}
              >
                <td className="px-4 py-3 font-medium text-text-primary">
                  <div className="flex items-center gap-2">
                    <FiFile className="w-4 h-4 text-text-muted shrink-0" />
                    {submission.submissionFile}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex flex-col">
                    <span className="text-text-primary">{submission.studentName}</span>
                    <span className="text-xs text-text-muted">{submission.studentCode}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <SubmissionStatusBadge
                    status={submission.status}
                    statusName={submission.statusName}
                  />
                </td>
                <td className="px-4 py-3">
                  <ScoreCell score={submission.aiScore} />
                </td>
                <td className="px-4 py-3">
                  <ScoreCell score={submission.lecturerScore} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onView(submission)}
                    disabled={!canView}
                    className="rounded-md p-1.5 text-text-muted enabled:hover:bg-bg-muted enabled:hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Xem chi tiết chấm điểm"
                    title={!canView ? 'Chưa có kết quả chấm AI' : 'Xem chi tiết'}
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