
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FiFileText, FiCpu, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import { FaEye } from 'react-icons/fa'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'
import type { GradingSessionType, MonitorAssignmentType } from '../types/grading_session_monitor'
import useMonitorAiGrade from '../hooks/useMonitorAiGrade'
import { ASSIGNMENT_STATUS_OPTIONS, getAssignmentStatus, getAssignmentStatusClass } from '../const/assignment_status'
import type { AssignmentStatus } from '@/features/manager/grading_session/hooks/useMonitorUpdateAssignment'
import useMonitorUpdateAssignment from '@/features/manager/grading_session/hooks/useMonitorUpdateAssignment'

interface MonitorGradingAssignmentsModalProps {
    session: GradingSessionType | null
    isOpen: boolean
    onClose: () => void
}

export default function MonitorGradingAssignmentsModal({
    session,
    isOpen,
    onClose
}: MonitorGradingAssignmentsModalProps) {
    const navigate = useNavigate()
    const { handleAIGrade, loading: aiGrading } = useMonitorAiGrade()
    const { updateAssignmentStatus, isUpdating } = useMonitorUpdateAssignment()
    const [assignments, setAssignments] = useState<MonitorAssignmentType[]>([])
    const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null)
    const [editingStatus, setEditingStatus] = useState<AssignmentStatus | null>(null)

    // Sync assignments when session changes
    useEffect(() => {
        const initialLoad = () => {
            setAssignments(session?.assignments ?? [])
            setEditingAssignmentId(null)
            setEditingStatus(null)
        }
        initialLoad()
    }, [session])

    // Navigate to submission detail
    const handleViewSubmission = (submissionId: string) => {
        navigate(`/monitor/grading/submissions/${submissionId}`)
    }

    // Start editing
    const handleStartEdit = (assignment: MonitorAssignmentType) => {
        setEditingAssignmentId(assignment.assignmentId)
        setEditingStatus(assignment.status as AssignmentStatus)
    }

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingAssignmentId(null)
        setEditingStatus(null)
    }

    // Save status
    const handleSaveStatus = async () => {
        if (!session || !editingAssignmentId || editingStatus === null) {
            return
        }

        const currentAssignment = assignments.find(
            (item) => item.assignmentId === editingAssignmentId
        )

        if (!currentAssignment) return

        // Skip API if status has not changed
        if (currentAssignment.status === editingStatus) {
            handleCancelEdit()
            return
        }

        const success = await updateAssignmentStatus({
            gradingSessionId: session.gradingSessionId,
            assignmentId: editingAssignmentId,
            status: editingStatus
        })

        if (!success) return

        setAssignments((prev) =>
            prev.map((assignment) =>
                assignment.assignmentId === editingAssignmentId
                    ? {
                        ...assignment,
                        status: editingStatus
                    }
                    : assignment
            )
        )

        setEditingAssignmentId(null)
        setEditingStatus(null)
    }

    if (!session) return null

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Chi tiết bài được phân công"
            maxWidth="xl"
        >
            <div className="space-y-5 px-5 py-4">

                {/* Session information */}
                <div className="rounded-lg border border-border-default bg-bg-muted/40 p-4">
                    <h3 className="font-semibold text-text-primary">
                        {session.title}
                    </h3>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-text-muted">Tổng bài nộp</p>
                            <p className="mt-1 font-medium text-text-primary">
                                {session.numberSubmissions}
                            </p>
                        </div>

                        <div>
                            <p className="text-text-muted">Đã phân công</p>
                            <p className="mt-1 font-medium text-text-primary">
                                {session.assignedCount}
                            </p>
                        </div>

                        <div>
                            <p className="text-text-muted">Hạn chấm</p>
                            <p className="mt-1 font-medium text-text-primary">
                                {formatDate(session.deadline)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assignment list */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <FiFileText
                            className="text-brand-orange"
                            size={18}
                        />

                        <h3 className="font-semibold text-text-primary">
                            Danh sách bài được giao
                        </h3>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border-default">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                {/* Table header */}
                                <thead className="bg-bg-muted text-text-secondary">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">
                                            STT
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Trạng thái
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Ngày phân công
                                        </th>

                                        <th className="px-4 py-3 font-semibold">
                                            Cập nhật
                                        </th>

                                        <th className="px-4 py-3 text-center font-semibold">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table body */}
                                <tbody className="divide-y divide-border-default">
                                    {assignments.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-text-muted"
                                            >
                                                Chưa có bài nộp nào được phân công.
                                            </td>
                                        </tr>
                                    ) : (
                                        assignments.map((assignment, index) => {
                                        const isEditing = editingAssignmentId === assignment.assignmentId
                                            return (
                                                <tr
                                                    key={assignment.assignmentId}
                                                    className="transition-colors hover:bg-bg-muted/50"
                                                >
                                                    {/* Index */}
                                                    <td className="px-4 py-3 text-text-secondary">
                                                        {index + 1}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-4 py-3">
                                                        {isEditing ? (
                                                            <select
                                                                value={
                                                                    editingStatus ?? assignment.status
                                                                }
                                                                onChange={(event) =>
                                                                    setEditingStatus(
                                                                        Number(event.target.value) as AssignmentStatus
                                                                    )
                                                                }
                                                                disabled={isUpdating}
                                                                autoFocus
                                                                className="min-w-[145px] rounded-md border border-brand-orange bg-bg-primary px-3 py-1.5 text-xs text-text-primary outline-none transition-colors focus:ring-2 focus:ring-brand-orange/20 disabled:opacity-50"
                                                            >
                                                                {ASSIGNMENT_STATUS_OPTIONS.map(
                                                                    (option) => (
                                                                        <option
                                                                            key={option.value}
                                                                            value={option.value}
                                                                        >
                                                                            {option.label}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        ) : (
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getAssignmentStatusClass(assignment.status)}`}
                                                            >
                                                                {getAssignmentStatus(assignment.status)}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Assigned date */}
                                                    <td className="px-4 py-3 text-text-secondary">
                                                        {formatDate(assignment.assignedDate)}
                                                    </td>

                                                    {/* Updated date */}
                                                    <td className="px-4 py-3 text-text-secondary">
                                                        {formatDate(assignment.updatedDate)}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">

                                                            {isEditing ? (
                                                                <>
                                                                    {/* Save */}
                                                                    <Button
                                                                        variant="success"
                                                                        size="basic"
                                                                        title="Lưu trạng thái"
                                                                        aria-label="Lưu trạng thái"
                                                                        disabled={isUpdating}
                                                                        onClick={handleSaveStatus}
                                                                    >
                                                                        <FiCheck className="h-4 w-4" />
                                                                    </Button>

                                                                    {/* Cancel */}
                                                                    <Button
                                                                        variant="basic"
                                                                        size="basic"
                                                                        title="Hủy chỉnh sửa"
                                                                        aria-label="Hủy chỉnh sửa"
                                                                        disabled={isUpdating}
                                                                        onClick={handleCancelEdit}
                                                                    >
                                                                        <FiX className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {/* Edit status */}
                                                                    <Button
                                                                        variant="brand"
                                                                        size="basic"
                                                                        title="Chỉnh sửa trạng thái"
                                                                        aria-label={`Chỉnh sửa trạng thái bài ${index + 1}`}
                                                                        disabled={editingAssignmentId !== null}
                                                                        onClick={() =>
                                                                            handleStartEdit(assignment)
                                                                        }
                                                                    >
                                                                        <FiEdit2 className="h-4 w-4" />
                                                                    </Button>

                                                                    {/* AI Grading */}
                                                                    <Button
                                                                        variant="brand"
                                                                        size="basic"
                                                                        title="Chấm điểm bằng AI"
                                                                        aria-label={`Chấm điểm AI bài nộp ${index + 1}`}
                                                                        disabled={
                                                                            aiGrading ||
                                                                            editingAssignmentId !== null
                                                                        }
                                                                        onClick={() =>
                                                                            handleAIGrade(
                                                                                assignment.submissionId
                                                                            )
                                                                        }
                                                                    >
                                                                        <FiCpu className="h-4 w-4" />
                                                                    </Button>

                                                                    {/* View submission */}
                                                                    <Button
                                                                        variant="basic"
                                                                        size="basic"
                                                                        title="Xem bài nộp"
                                                                        aria-label={`Xem bài nộp ${index + 1}`}
                                                                        onClick={() =>
                                                                            handleViewSubmission(
                                                                                assignment.submissionId
                                                                            )
                                                                        }
                                                                    >
                                                                        <FaEye className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-border-default pt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="basic"
                    >
                        Đóng
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
