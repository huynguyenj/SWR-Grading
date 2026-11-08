
import { FiCalendar, FiClock, FiBookOpen, FiLayers } from 'react-icons/fi'

import { formatDate } from '@/utils/format'
import Button from '@/components/ui/button'
import { SESSION_STATUS_CLASS, SESSION_STATUS_LABEL, type ExaminationSessionType } from '@/features/examiner/management/examination/types/exam_session'
import { FaPlus } from 'react-icons/fa'

interface ExaminationSessionTableProps {
  sessions?: ExaminationSessionType[]
  loading?: boolean
  onCreateGradingSession: (examSessionId: string) => void
}


function formatTime(time?: string): string {
  if (!time) return 'Chưa xác định'
  return time.slice(0, 5)
}

export default function ManagerExamSessionTable({
  sessions,
  loading = false,
  onCreateGradingSession
}: ExaminationSessionTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">
          Đang tải danh sách đợt thi...
        </p>
      </div>
    )
  }

  if (!sessions?.length) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <FiLayers className="mx-auto mb-3 h-8 w-8 text-text-muted" />

        <p className="text-sm font-medium text-text-primary">
          Chưa có đợt thi nào
        </p>

        <p className="mt-1 text-xs text-text-muted">
          Danh sách các đợt thi sẽ được hiển thị tại đây.
        </p>
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">
              Đợt thi
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Kỳ thi
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Học kỳ
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Thời gian
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Trạng thái
            </th>
            <th className="px-4 py-3 font-medium text-text-secondary">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session) => (
            <tr
              key={`${session.examinationId}-${session.examinationCode}`}
              className="border-b border-border-default last:border-0 transition-colors hover:bg-bg-muted/40"
            >
              {/* Examination session */}
              <td className="px-4 py-3">
                <p className="font-medium text-text-primary">
                  {session.examinationCode}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  Đợt thi
                </p>
              </td>

              {/* Examination */}
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <FiBookOpen className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                  <div>
                    <p className="font-medium text-text-primary">
                      {session.examination?.name || 'Chưa có thông tin'}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      {session.examination?.examinationCode || ''}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                       Bắt đầu: {formatDate(session.examination.startDate)}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                       Kết thúc: {formatDate(session.examination.endDate)}
                    </p>
                  </div>
                </div>
              </td>

              {/* Semester */}
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <FiLayers className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                  <div>
                    <p className="font-medium text-text-primary">
                      {session.semester?.name || 'Chưa có thông tin'} ({session.semester?.semesterCode || ''})
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                       Bắt đầu: {formatDate(session.semester.startDate)}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                       Kết thúc: {formatDate(session.semester.endDate)}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                    </p>
                  </div>
                </div>
              </td>

              {/* Date and time */}
              <td className="px-4 py-3">
                <div className="space-y-1.5 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="h-3.5 w-3.5 text-text-muted" />

                    <span>
                      {session.startDate
                        ? formatDate(session.startDate)
                        : 'Chưa xác định'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <FiClock className="h-3.5 w-3.5 text-text-muted" />

                    <span>{formatTime(session.startTime)}</span>
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    SESSION_STATUS_CLASS[session.status]
                  }`}
                >
                  {SESSION_STATUS_LABEL[session.status]}
                </span>
              </td>
              {/* Thao tác */}
            <td className="px-4 py-3">
               <div>
                  <Button
                     onClick={() => onCreateGradingSession(session.examinationSessionId)}
                     variant='basic'
                     className='p-1.5'
                  >
                      <FaPlus/>  
                  </Button>
               </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
