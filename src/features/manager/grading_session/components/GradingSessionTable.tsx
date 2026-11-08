import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiLayers,
} from 'react-icons/fi'

import type { GradingSessionType } from '../types/grading_session_type'
import { formatDate } from '@/utils/format'
import Button from '@/components/ui/button'
import { FaEye, FaTasks } from 'react-icons/fa'

interface GradingSessionTableProps {
  sessions?: GradingSessionType[]
  loading?: boolean
  onViewAssignment: (gradingSessionId: string) => void
  onAssign: (gradingSessionId: string) => void
}

function formatDeadline(deadline?: string): string {
  if (!deadline) return 'Chưa xác định'
  return formatDate(deadline)
}

export default function GradingSessionTable({
  sessions,
  loading = false,
  onViewAssignment,
  onAssign
}: GradingSessionTableProps) {
  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">
          Đang tải danh sách phiên chấm...
        </p>
      </div>
    )
  }

  // Empty state
  if (!sessions?.length) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <FiLayers className="mx-auto mb-3 h-8 w-8 text-text-muted" />

        <p className="text-sm font-medium text-text-primary">
          Chưa có phiên chấm nào
        </p>

        <p className="mt-1 text-xs text-text-muted">
          Danh sách các phiên chấm sẽ được hiển thị tại đây.
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
              Phiên chấm
            </th>

            {/* <th className="px-4 py-3 font-medium text-text-secondary">
              Đợt thi
            </th> */}

            <th className="px-4 py-3 font-medium text-text-secondary">
              Hạn chấm
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Bài nộp
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Ngày tạo
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Cập nhật lần cuối
            </th>
            <th className="px-4 py-3 font-medium text-text-secondary">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session) => (
            <tr
              key={session.gradingSessionId}
              className="border-b border-border-default last:border-0 transition-colors hover:bg-bg-muted/40"
            >
              {/* Grading session */}
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <FiLayers className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                  <div>
                    <p className="font-medium text-text-primary">
                      {session.title || 'Chưa có tên phiên chấm'}
                    </p>
                  </div>
                </div>
              </td>

              {/* Examination session */}
              {/* <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                  <div>
                    <p className="font-medium text-text-primary">
                      Đợt thi
                    </p>
                  </div>
                </div>
              </td> */}

              {/* Deadline */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <FiCalendar className="h-3.5 w-3.5 shrink-0 text-text-muted" />

                  <span>
                    {formatDeadline(session.deadline)}
                  </span>
                </div>
              </td>

              {/* Number of submissions */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FiFileText className="h-3.5 w-3.5 text-text-muted" />

                  <span className="font-medium text-text-primary">
                    {session.numberSubmissions ?? 0}
                  </span>

                  <span className="text-xs text-text-muted">
                    bài nộp
                  </span>
                </div>
              </td>

              {/* Created date */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <FiCalendar className="h-3.5 w-3.5 shrink-0 text-text-muted" />

                  <span>
                    {session.createdDate
                      ? formatDate(session.createdDate)
                      : 'Chưa xác định'}
                  </span>
                </div>
              </td>

              {/* Updated date */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <FiClock className="h-3.5 w-3.5 shrink-0 text-text-muted" />

                  <span>
                    {session.updatedDate
                      ? formatDate(session.updatedDate)
                      : 'Chưa xác định'}
                  </span>
                </div>
              </td>
            {/* Thao tác */}
              <td className="px-4 py-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                        onClick={() => onViewAssignment(session.gradingSessionId)}
                        variant='basic'

                  >
                        <FaEye className='w-4 h-4'/>
                  </Button>
                  <Button
                        variant='basic'
                        onClick={() => onAssign(session.gradingSessionId)}

                  >
                        <FaTasks className='w-4 h-4'/>
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