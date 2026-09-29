import { FiFile, FiEye, FiCalendar } from 'react-icons/fi'
import type { SubmissionStatus, SubmissionType } from '../types/submission.type'
import SubmissionStatusBadge from './SubmissionFileBadge'
import { formatDate } from '@/utils/format'

interface SubmissionFilesTableProps {
  submissions: SubmissionType[]
  onView: (submission: SubmissionType) => void
}

// SubmissionType không còn statusName từ BE nên tự map nhãn theo enum
const STATUS_LABEL: Record<SubmissionStatus, string> = {
  '0': 'Đã nộp',
  '1': 'AI đã chấm',
  '2': 'GV đã duyệt',
  '3': 'Hoàn tất',
}

/**
 * aiScore/lecturerScore giờ là `number` (không null) nên bài chưa chấm sẽ mang giá trị
 * mặc định 0 — phải dựa vào status để biết điểm đã thật sự có hay chưa,
 * nếu không sẽ highlight đỏ nhầm cho mọi bài mới nộp.
 */
function ScoreCell({ score, visible }: { score: number; visible: boolean }) {
  if (!visible) return <span className="text-text-muted">—</span>
  return (
    <span
      className={[
        'inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold',
        score === 0 ? 'bg-danger/10 text-danger' : 'text-text-primary',
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
            <th className="px-4 py-3 font-medium text-text-secondary">Ngày nộp</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Điểm AI</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Điểm GV</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const aiVisible = submission.aiScore ? true : false
            const lecturerVisible = submission.lecturerScore ? true : false
            // Điểm cuối cùng: ưu tiên điểm giảng viên nếu đã duyệt
            const finalScore = lecturerVisible ? submission.lecturerScore : submission.aiScore
            const isZero = aiVisible && finalScore === 0

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
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                    {formatDate(submission.createdDate)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <SubmissionStatusBadge
                    status={submission.status}
                    statusName={STATUS_LABEL[submission.status]}
                  />
                </td>
                <td className="px-4 py-3">
                  <ScoreCell score={submission.aiScore} visible={aiVisible} />
                </td>
                <td className="px-4 py-3">
                  <ScoreCell score={submission.lecturerScore} visible={lecturerVisible} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onView(submission)}
                    disabled={!aiVisible}
                    className="rounded-md p-1.5 text-text-muted enabled:hover:bg-bg-muted enabled:hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Xem chi tiết chấm điểm"
                    title={!aiVisible ? 'Chưa có kết quả chấm AI' : 'Xem chi tiết'}
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