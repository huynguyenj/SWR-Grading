import {
  FiUser,
  FiEye,
  FiAward,
  FiCalendar,
} from 'react-icons/fi'

import { formatDate } from '@/utils/format'
import Loading_Circle from '@/components/ui/loading_circle'
import type { OfficialSubmission } from '../types/official_submission'

interface OfficialSubmissionTableProps {
  submissions?: OfficialSubmission[]
  loading: boolean
  onViewDetail: (submission: OfficialSubmission) => void
}

export default function OfficialSubmissionTable({
  submissions = [],
  loading,
  onViewDetail,
}: OfficialSubmissionTableProps) {
  // Loading state
  if (loading && submissions.length === 0) {
    return <Loading_Circle />
  }

  // Empty state
  if (submissions.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary px-4 text-center">
        <FiAward className="mb-3 h-10 w-10 text-text-muted" />

        <h3 className="font-medium text-text-primary">
          Không tìm thấy bài thi chính thức
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          Không có bài thi nào phù hợp với bộ lọc hiện tại.
        </p>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-bg-primary/40 pt-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
        </div>
      )}

      <table className="w-full min-w-[1100px] text-left text-sm">
        <thead className="bg-bg-muted/50 text-xs uppercase text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Sinh viên</th>
            <th className="px-4 py-3 font-medium">Đợt thi</th>
            <th className="px-4 py-3 font-medium">Bộ đề</th>
            <th className="px-4 py-3 font-medium">Học kỳ</th>
            <th className="px-4 py-3 font-medium">Điểm chính thức</th>
            <th className="px-4 py-3 font-medium">Người chấm</th>
            <th className="px-4 py-3 font-medium">Ngày chấm</th>
            <th className="px-4 py-3 text-center font-medium">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((submission, index) => (
            <tr
              key={submission.submissionId}
              className="border-b border-border-default transition-colors last:border-b-0 hover:bg-bg-muted/40"
            >
              {/* Index */}
              <td className="px-4 py-3 text-text-muted">
                {(index + 1)}
              </td>

              {/* Student */}
              <td className="px-4 py-3">
                <div className="flex min-w-48 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <FiUser className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {submission.studentName}
                    </p>

                    <p className="truncate text-xs text-text-secondary">
                      {submission.studentCode}
                    </p>
                  </div>
                </div>
              </td>

              {/* Examination */}
              <td className="px-4 py-3">
                <div className="min-w-40">
                  <p className="font-medium text-text-primary">
                    {submission.examinationName}
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    {submission.examinationCode}
                  </p>
                </div>
              </td>

              {/* Paper set */}
              <td className="px-4 py-3">
                <span className="rounded-md bg-bg-muted px-2 py-1 text-xs font-medium text-text-secondary">
                  {submission.paperSetCode || '—'}
                </span>
              </td>

              {/* Semester */}
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-text-primary">
                    {submission.semesterName}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {submission.semesterCode}
                  </p>
                </div>
              </td>

              {/* Official score */}
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2 rounded-lg bg-brand-orange/10 px-3 py-1.5 font-semibold text-brand-orange">
                  <FiAward className="h-4 w-4" />
                  {submission.officialScore}
                </span>
              </td>

              {/* Graded by */}
              <td className="px-4 py-3">
                <p className="max-w-40 truncate text-text-secondary">
                  {submission.gradedBy || '—'}
                </p>
              </td>

              {/* Graded date */}
              <td className="px-4 py-3 text-text-secondary">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <FiCalendar className="h-3.5 w-3.5" />
                  {formatDate(submission.gradedAt)}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onViewDetail(submission)}
                    title="Xem chi tiết bài thi"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default text-text-secondary transition-colors hover:border-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange"
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}