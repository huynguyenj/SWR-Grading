import {
  FiX,
  FiUsers,
  FiCalendar,
  FiClock,
  FiLayers,
  FiUser,
} from 'react-icons/fi'

import Button from '@/components/ui/button'
import useGetAssignmentGradingSession from '../hooks/useGetAssignmentGradingSession'
import type { AssignmentType } from '../types/assignment_type'
import { formatDate } from '@/utils/format'

interface ViewGradingSessionAssignmentsProps {
  gradingSessionId: string
  isOpen: boolean
  onClose: () => void
}

function getAssignmentStatus(status: number): string {
  // Cần điều chỉnh theo enum Status thực tế từ Backend.
  return `Trạng thái ${status}`
}

interface AssignmentRowProps {
  assignment: AssignmentType
}

function AssignmentRow({ assignment }: AssignmentRowProps) {
  return (
    <tr className="border-b border-border-default last:border-0 transition-colors hover:bg-bg-muted/40">
      {/* Staff */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-muted">
            <FiUser className="h-4 w-4 text-text-secondary" />
          </div>

          <div>
            <p className="font-medium text-text-primary">
              Giảng viên
            </p>

            <p className="mt-0.5 text-xs text-text-muted">
              ID: {assignment.staffId}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
          {getAssignmentStatus(assignment.status)}
        </span>
      </td>

      {/* Assigned date */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiCalendar className="h-3.5 w-3.5 shrink-0 text-text-muted" />

          <span>
            {formatDate(assignment.assignedDate)}
          </span>
        </div>
      </td>

      {/* Updated date */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiClock className="h-3.5 w-3.5 shrink-0 text-text-muted" />

          <span>
            {formatDate(assignment.updatedDate)}
          </span>
        </div>
      </td>
    </tr>
  )
}

export default function ViewGradingSessionAssignments({
  gradingSessionId,
  isOpen,
  onClose,
}: ViewGradingSessionAssignmentsProps) {
  const { assignmentList, loading } = useGetAssignmentGradingSession({
    gradingSessionId,
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border-default bg-bg-primary shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <FiUsers className="h-5 w-5 text-brand-orange" />

              <h2 className="text-lg font-semibold text-text-primary">
                Danh sách phân công
              </h2>
            </div>

            <p className="mt-1 text-sm text-text-secondary">
              Danh sách giảng viên được phân công trong phiên chấm này.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-primary"
            aria-label="Đóng"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Grading session information */}
        <div className="border-b border-border-default bg-bg-surface px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <FiLayers className="h-4 w-4 text-text-muted" />

            <span>Phiên chấm:</span>

            <span className="font-medium text-text-primary">
              {gradingSessionId}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-auto p-6">
          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center">
              <p className="text-sm text-text-muted">
                Đang tải danh sách phân công...
              </p>
            </div>
          ) : !assignmentList?.length ? (
            /* Empty state */
            <div className="rounded-lg border border-border-default bg-bg-surface py-16 text-center">
              <FiUsers className="mx-auto mb-3 h-9 w-9 text-text-muted" />

              <p className="text-sm font-medium text-text-primary">
                Chưa có giảng viên được phân công
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Danh sách giảng viên được phân công sẽ hiển thị tại đây.
              </p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="mb-4 flex items-center gap-2">
                <FiUsers className="h-4 w-4 text-text-muted" />

                <p className="text-sm text-text-secondary">
                  Tổng số giảng viên được phân công:

                  <span className="ml-1 font-semibold text-text-primary">
                    {assignmentList.length}
                  </span>
                </p>
              </div>

              {/* Assignment table */}
              <div className="overflow-x-auto rounded-lg border border-border-default">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-default bg-bg-muted/50 text-left">
                      <th className="px-4 py-3 font-medium text-text-secondary">
                        Giảng viên
                      </th>

                      <th className="px-4 py-3 font-medium text-text-secondary">
                        Trạng thái
                      </th>

                      <th className="px-4 py-3 font-medium text-text-secondary">
                        Ngày phân công
                      </th>

                      <th className="px-4 py-3 font-medium text-text-secondary">
                        Cập nhật lần cuối
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {assignmentList.map((assignment) => (
                      <AssignmentRow
                        key={assignment.assignmentId}
                        assignment={assignment}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border-default px-6 py-4">
          <Button
            variant="basic"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}