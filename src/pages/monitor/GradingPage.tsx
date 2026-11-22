import Pagination from '@/components/ui/pagination'
import MonitorGradingAssignmentsModal from '@/features/lecturer/grading_sessions/components/MonitorGradingAssignmentModal'
import MonitorGradingSessionTable from '@/features/lecturer/grading_sessions/components/MonitorGradingSessionTable'
import useGetMonitorGradingSession from '@/features/lecturer/grading_sessions/hooks/useGetMonitorGradingSession'
import type { GradingSessionType } from '@/features/lecturer/grading_sessions/types/grading_session_monitor'
import { useState } from 'react'

export default function GradingPage() {
    const {
        gradingSessionDataList,
        loading,
        currentGradingSessionPage,
        pageGradingSessionSize,
        setCurrentGradingSessionPage,
        setPageGradingSessionSize
    } = useGetMonitorGradingSession()

    const [selectedGradingSession, setSelectedGradingSession] =
        useState<GradingSessionType | null>(null)

    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)

    const handleOpenAssignments = (session: GradingSessionType) => {
        setSelectedGradingSession(session)
        setAssignmentModalOpen(true)
    }

    const handleCloseAssignments = () => {
        setSelectedGradingSession(null)
        setAssignmentModalOpen(false)
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold text-text-primary">
                    Các phiên chấm bài
                </h1>

                <p className="mt-1 text-sm text-text-secondary">
                    Theo dõi các phiên chấm và danh sách bài thi được phân công.
                </p>
            </div>

            {/* Grading session table */}
            <MonitorGradingSessionTable
                sessions={gradingSessionDataList?.items}
                loading={loading}
                onViewAssignments={handleOpenAssignments}
            />

            {/* Pagination */}
            {gradingSessionDataList &&
                gradingSessionDataList.totalPages > 0 && (
                    <Pagination
                        currentPage={currentGradingSessionPage}
                        onPageChange={setCurrentGradingSessionPage}
                        totalPages={gradingSessionDataList.totalPages}
                        onPageSizeChange={(size) => {
                            setPageGradingSessionSize(size)
                            setCurrentGradingSessionPage(1)
                        }}
                        pageSize={pageGradingSessionSize}
                    />
                )}

            {/* Assignment detail modal */}
            <MonitorGradingAssignmentsModal
                session={selectedGradingSession}
                isOpen={assignmentModalOpen}
                onClose={handleCloseAssignments}
            />
        </div>
    )
}