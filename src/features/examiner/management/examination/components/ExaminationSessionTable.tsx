import type { ExaminationSessionType } from '../types/exam_session'
import { formatDate } from '@/utils/format'
import {
  FiEdit2,
  FiEye,
  FiUpload,
} from 'react-icons/fi'

interface ExaminationSessionTableProps {
  sessions?: ExaminationSessionType[]
  loading?: boolean
  onUploadSelectedSession: (examinationSessionId: string) => void
  onViewDetail: (examinationSessionId: string) => void
  onEditSession: (examinationSessionId: string) => void
}

const SESSION_STATUS_LABEL: Record<number, string> = {
  0: 'Nháp',
  1: 'Đang diễn ra',
  2: 'Đã đóng',
  3: 'Đã hoàn thành',
  4: 'Đã hủy',
}

const getStatusClassName = (status: number): string => {
  switch (status) {
    case 0:
      return 'bg-bg-muted text-text-secondary'
    case 1:
      return 'bg-green-100 text-green-700'
    case 2:
      return 'bg-orange-100 text-orange-700'
    case 3:
      return 'bg-blue-100 text-blue-700'
    case 4:
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-bg-muted text-text-secondary'
  }
}

const ExaminationSessionTable = ({
  sessions = [],
  loading = false,
  onUploadSelectedSession,
  onViewDetail,
  onEditSession,
}: ExaminationSessionTableProps) => {
  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-border-default bg-bg-primary">
        <p className="text-sm text-text-secondary">
          Đang tải danh sách đợt thi...
        </p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-border-default bg-bg-primary">
        <p className="text-sm text-text-secondary">
          Chưa có đợt thi nào.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full min-w-[1000px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted">
            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              STT
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              Mã đợt thi
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              Tên kỳ thi
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              Học kỳ
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              Ngày thi
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              Giờ bắt đầu
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              Bài nộp
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-text-primary">
              Trạng thái
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold text-text-primary">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session, index) => (
            <tr
              key={session.examinationSessionId}
              className="border-b border-border-default last:border-b-0 hover:bg-bg-muted/50"
            >
              <td className="px-4 py-3 text-sm text-text-secondary">
                {index + 1}
              </td>

              <td className="px-4 py-3 text-sm font-medium text-text-primary">
                {session.examinationCode || '-'}
              </td>

              <td className="px-4 py-3 text-sm text-text-primary">
                {session.examination?.name || '-'}
              </td>

              <td className="px-4 py-3 text-sm text-text-secondary">
                {session.semester?.semesterCode ||
                  session.semester?.name ||
                  '-'}
              </td>

              <td className="px-4 py-3 text-sm text-text-secondary">
                {session.startDate
                  ? formatDate(session.startDate)
                  : '-'}
              </td>

              <td className="px-4 py-3 text-sm text-text-secondary">
                {session.startTime || '-'}
              </td>

              <td className="px-4 py-3 text-sm text-text-secondary">
                {session.totalSubmission ?? 0}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(session.status)}`}
                >
                  {SESSION_STATUS_LABEL[session.status] ?? 'Không xác định'}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    title="Xem chi tiết"
                    onClick={() =>
                      onViewDetail(session.examinationSessionId)
                    }
                    className="rounded-md p-2 text-text-secondary transition-colors hover:bg-bg-muted hover:text-brand-orange"
                  >
                    <FiEye size={17} />
                  </button>

                  <button
                    type="button"
                    title="Chỉnh sửa đợt thi"
                    onClick={() =>
                      onEditSession(session.examinationSessionId)
                    }
                    className="rounded-md p-2 text-text-secondary transition-colors hover:bg-bg-muted hover:text-brand-orange"
                  >
                    <FiEdit2 size={17} />
                  </button>

                  <button
                    type="button"
                    title="Upload bài nộp"
                    onClick={() =>
                      onUploadSelectedSession(session.examinationSessionId)
                    }
                    className="rounded-md p-2 text-text-secondary transition-colors hover:bg-bg-muted hover:text-brand-orange"
                  >
                    <FiUpload size={17} />
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

export default ExaminationSessionTable