
import { useEffect, useState } from 'react'
import {
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiUser,
  FiSave,
  FiX,
} from 'react-icons/fi'
import { FaEdit } from 'react-icons/fa'

import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'
import { getAssignmentStatus, ASSIGNMENT_STATUS_OPTIONS } from '@/features/lecturer/grading_sessions/const/assignment_status'

import type { AssignmentType } from '../types/assignment_type'
import useUpdateAssignmentStatus, { type AssignmentStatus } from '@/features/examiner/management/examination/hooks/useUpdateAssignmentStatus'

interface AssignmentRowProps {
  assignment: AssignmentType
}

export default function AssignmentRow({
  assignment,
}: AssignmentRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus>(
    assignment.status as AssignmentStatus,
  )
  const [updateError, setUpdateError] = useState('')

  const { updateAssignmentStatus, loading } =
    useUpdateAssignmentStatus()

  // Đồng bộ trạng thái khi dữ liệu assignment từ bên ngoài thay đổi.
  useEffect(() => {
   const initialStatus = () => {
         setSelectedStatus(assignment.status as AssignmentStatus)
   }
   initialStatus()
  }, [assignment.status])

  const handleEdit = () => {
    setSelectedStatus(assignment.status as AssignmentStatus)
    setUpdateError('')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setSelectedStatus(assignment.status as AssignmentStatus)
    setUpdateError('')
    setIsEditing(false)
  }

  const handleSave = async () => {
    setUpdateError('')

    const success = await updateAssignmentStatus({
      gradingSessionId: assignment.gradingSessionId,
      assignmentId: assignment.assignmentId,
      staffId: assignment.staffId,
      status: selectedStatus,
    })

    if (!success) {
      setUpdateError('Không thể cập nhật trạng thái. Vui lòng thử lại.')
      return
    }

    setIsEditing(false)
  }

  return (
    <tr className="border-b border-border-default last:border-0 transition-colors hover:bg-bg-muted/40">
      {/* Lecturer */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-muted">
            <FiUser className="h-4 w-4 text-text-secondary" />
          </div>

          <div>
            <p className="font-medium text-text-primary">
              {assignment.staff.fullName}
            </p>

            <p className="mt-0.5 text-xs text-text-muted">
              {assignment.staff.staffCode}
            </p>

            <p className="mt-0.5 text-xs text-text-muted">
              {assignment.staff.email}
            </p>
          </div>
        </div>
      </td>

      {/* Student */}
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-text-primary">
            {assignment.student.fullName}
          </p>

          <p className="mt-0.5 text-xs text-text-muted">
            {assignment.student.studentCode}
          </p>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <div className="flex flex-col items-start gap-1.5">
          {isEditing ? (
            <>
              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    Number(event.target.value) as AssignmentStatus,
                  )
                }
                disabled={loading}
                className="w-full min-w-[150px] rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-brand-orange disabled:cursor-not-allowed disabled:opacity-60"
              >
                {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {updateError && (
                <p className="max-w-[180px] text-xs text-red-500">
                  {updateError}
                </p>
              )}
            </>
          ) : (
            <>
              <span className="inline-flex items-center rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
                {getAssignmentStatus(
                  assignment.status as AssignmentStatus,
                )}
              </span>

              {assignment.isReassigned && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                  <FiRefreshCw className="h-3 w-3" />
                  Đã phân công lại
                </span>
              )}
            </>
          )}
        </div>
      </td>

      {/* Assigned date */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiCalendar className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <span>{formatDate(assignment.assignedDate)}</span>
        </div>
      </td>

      {/* Updated date */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <FiClock className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <span>{formatDate(assignment.updatedDate)}</span>
        </div>
      </td>

      {/* Status action */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {isEditing ? (
            <>
              <Button
                variant="brand"
                onClick={handleSave}
                disabled={loading}
              >
                <FiSave className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="basic"
                onClick={handleCancel}
                disabled={loading}
              >
                <FiX className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button
              variant="basic"
              onClick={handleEdit}
            >
              <FaEdit className="h-3.5 w-3.5 text-text-muted" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
