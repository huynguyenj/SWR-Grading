
import { useMemo, useState } from 'react'
import {
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiFileText,
  FiLayers,
  FiSearch,
  FiUsers,
  FiX,
} from 'react-icons/fi'

import useGetAssignmentGradingSession from '../hooks/useGetAssignmentGradingSession'
import AssignmentRow from './AssignmentRow'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'

interface ViewGradingSessionAssignmentsProps {
  open: boolean
  onClose: () => void
  gradingSessionId: string
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-bg-muted p-2 text-text-secondary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-semibold text-text-primary">
          {value}
        </p>
      </div>
    </div>
  )
}


export default function ViewGradingSessionAssignments({
  open,
  onClose,
  gradingSessionId,
}: ViewGradingSessionAssignmentsProps) {
  const { assignmentList, loading } = useGetAssignmentGradingSession({
    gradingSessionId,
  })

  const [searchName, setSearchName] = useState('')

  // Thông tin chung của grading session.
  const firstAssignment = assignmentList?.[0]
  const examinationSession = firstAssignment?.examinationSession
  const paperSet = firstAssignment?.paperSet

  // Tìm kiếm theo tên giảng viên hoặc tên sinh viên.
  const filteredAssignments = useMemo(() => {
    if (!assignmentList) return []

    const keyword = searchName.trim().toLocaleLowerCase('vi')

    if (!keyword) return assignmentList

    return assignmentList.filter((assignment) => {
      const studentName = assignment.student.fullName
        .toLocaleLowerCase('vi')

      const lecturerName = assignment.staff.fullName
        .toLocaleLowerCase('vi')

      return (
        studentName.includes(keyword) ||
        lecturerName.includes(keyword)
      )
    })
  }, [assignmentList, searchName])


  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-border-default bg-bg-primary shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Danh sách phân công
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Thông tin giảng viên và sinh viên được phân công chấm bài
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {/* Session information */}
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-border-default bg-bg-surface p-5 md:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              icon={<FiBookOpen size={18} />}
              label="Tên kỳ thi"
              value={examinationSession?.examinationName ?? '—'}
            />

            <InfoItem
              icon={<FiCalendar size={18} />}
              label="Mã kỳ thi"
              value={examinationSession?.examinationCode ?? '—'}
            />

            <InfoItem
              icon={<FiLayers size={18} />}
              label="Học kỳ"
              value={
                examinationSession
                  ? `${examinationSession.semesterName} (${examinationSession.semesterCode})`
                  : '—'
              }
            />

            <InfoItem
              icon={<FiFileText size={18} />}
              label="Paper Set"
              value={paperSet?.paperSetCode ?? '—'}
            />
          </div>

          {/* Paper set details and total assignments */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-bg-muted px-4 py-2.5">
              <FiFileText className="text-text-secondary" />
              <span className="text-sm text-text-secondary">
                Số câu hỏi:
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {paperSet?.totalQuestions ?? 0}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-bg-muted px-4 py-2.5">
              <FiUsers className="text-text-secondary" />
              <span className="text-sm text-text-secondary">
                Tổng phân công:
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {assignmentList?.length ?? 0}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-sm my-2">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <Input
              type="text"
              value={searchName}
              size='basic'
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="Tìm theo tên giảng viên hoặc sinh viên..."
            />

            {searchName && (
              <button
                type="button"
                onClick={() => setSearchName('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                aria-label="Xóa tìm kiếm"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Assignment table */}
          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead className="bg-bg-muted">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Giảng viên
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Sinh viên
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Trạng thái
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Ngày phân công
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Cập nhật gần nhất
                  </th>
                  <th className="px-2 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-text-muted"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FiClock className="animate-spin" size={17} />
                        Đang tải danh sách phân công...
                      </div>
                    </td>
                  </tr>
                ) : filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <AssignmentRow
                      key={assignment.assignmentId}
                      assignment={assignment}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center"
                    >
                      <FiUsers
                        size={28}
                        className="mx-auto mb-3 text-text-muted"
                      />

                      <p className="text-sm font-medium text-text-primary">
                        {searchName.trim()
                          ? 'Không tìm thấy sinh viên phù hợp.'
                          : 'Chưa có dữ liệu phân công.'}
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        {searchName.trim()
                          ? 'Thử tìm kiếm bằng tên sinh viên khác.'
                          : 'Danh sách phân công hiện đang trống.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Filter result count */}
          {!loading && assignmentList && assignmentList.length > 0 && (
            <div className="mt-3 flex justify-end">
              <p className="text-xs text-text-muted">
                Đang hiển thị{' '}
                <span className="font-semibold text-text-primary">
                  {filteredAssignments.length}
                </span>
                {' / '}
                {assignmentList.length} phân công
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border-default px-6 py-4">
          <Button
            type="button"
            onClick={onClose}
            variant='basic'
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
