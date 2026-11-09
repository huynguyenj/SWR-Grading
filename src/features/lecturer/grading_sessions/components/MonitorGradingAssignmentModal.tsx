import Modal from '@/components/ui/modal'
import { FiFileText, FiCpu } from 'react-icons/fi'
import type { GradingSessionType, MonitorAssignmentType } from '../types/grading_session_monitor'
import Button from '@/components/ui/button'
import useMonitorAiGrade from '../hooks/useMonitorAiGrade'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router'

interface MonitorGradingAssignmentsModalProps {
    session: GradingSessionType | null
    isOpen: boolean
    onClose: () => void
}

const formatDateTime = (date: string): string => {
    if (!date) return '--'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return '--'

    return parsedDate.toLocaleString('vi-VN')
}

const getAssignmentStatus = (status: number): string => {
    // Thay mapping theo enum status thực tế từ Backend.
    return `Trạng thái ${status}`
}

export default function MonitorGradingAssignmentsModal({
    session,
    isOpen,
    onClose
}: MonitorGradingAssignmentsModalProps) {
    const { handleAIGrade, loading: aiGrading } = useMonitorAiGrade()
    const navigate = useNavigate()
    const handleViewSubmission = (submissionId: string) => {
        navigate(`/monitor/grading/submissions/${submissionId}`)
    }
    if (!session) return null

    const assignments: MonitorAssignmentType[] = session.assignments ?? []

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
                                {formatDateTime(session.deadline)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Assignment list */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <FiFileText className="text-brand-orange" size={18} />

                        <h3 className="font-semibold text-text-primary">
                            Danh sách bài được giao
                        </h3>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-border-default">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left text-sm">
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
                                        assignments.map((assignment, index) => (
                                            <tr
                                                key={assignment.assignmentId}
                                                className="hover:bg-bg-muted/50"
                                            >
                                                <td className="px-4 py-3 text-text-secondary">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-3 text-text-secondary">
                                                    {getAssignmentStatus(assignment.status)}
                                                </td>

                                                <td className="px-4 py-3 text-text-secondary">
                                                    {formatDateTime(assignment.assignedDate)}
                                                </td>

                                                <td className="px-4 py-3 text-text-secondary">
                                                    {formatDateTime(assignment.updatedDate)}
                                                </td>

                                                {/* AI Grading Action */}
                                                <td className="px-4 py-3 text-center">
                                                    <div className='flex gap-2'>
                                                        <button
                                                            type="button"
                                                            title="Chấm điểm bằng AI"
                                                            aria-label={`Chấm điểm AI bài nộp ${index + 1}`}
                                                            disabled={aiGrading}
                                                            onClick={() => handleAIGrade(assignment.submissionId)}
                                                            className="inline-flex items-center justify-center rounded-md border border-brand-orange/30 bg-brand-orange/10 p-2 text-brand-orange transition-colors hover:bg-brand-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <FiCpu className='w-4 h-4'/>
                                                        </button>
                                                        <Button
                                                            variant='basic'
                                                            className='p-2'
                                                            onClick={() => handleViewSubmission(assignment.submissionId)}
                                                        >
                                                            <FaEye className='w-4 h-4'/>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
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