import Pagination from '@/components/ui/pagination'
import useGetGradingSession from '@/features/manager/grading_session/hooks/useGetGradingSession'
import GradingSessionTable from '@/features/manager/grading_session/components/GradingSessionTable'
import ViewGradingSessionAssignments from '@/features/manager/grading_session/components/ViewGradingSessionAssignments'

import { useState } from 'react'
import AssignGradingModal from '@/features/manager/grading_session/components/AssignGradingModal'

export default function ManagerGradingSessionPage() {
  const {
    gradingSessionDataList,
    loading,
    currentGradingSessionPage,
    pageGradingSessionSize,
    setCurrentGradingSessionPage,
    setPageGradingSessionSize,
    refresh
  } = useGetGradingSession()

  const [viewAssignmentModalOpen, setViewAssignmentModalOpen] = useState(false)

  const [
    viewAssignmentGradingSessionSelected,
    setViewAssignmentGradingSessionSelected,
  ] = useState<string>('')
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [
    assignGradingSessionSelected,
    setAssignGradingSessionSelected
  ] = useState<string>('')
  // Open assignment modal
  const handleOpenViewAssignment = (gradingSessionId: string) => {
    setViewAssignmentGradingSessionSelected(gradingSessionId)
    setViewAssignmentModalOpen(true)
  }

  // Close assignment modal
  const handleCloseViewAssignment = () => {
    setViewAssignmentModalOpen(false)
    setViewAssignmentGradingSessionSelected('')
  }

    // Open assign modal
  const handleOpenAssign = (gradingSessionId: string) => {
    setAssignGradingSessionSelected(gradingSessionId)
    setAssignModalOpen(true)
  }

  // Close assignment modal
  const handleCloseAssign = () => {
    setAssignModalOpen(false)
    setAssignGradingSessionSelected('')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Các phiên chấm
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Theo dõi các phiên chấm, hạn chấm và số lượng bài nộp tương ứng.
        </p>
      </div>

      {/* Grading session table */}
      <GradingSessionTable
        sessions={gradingSessionDataList?.items}
        loading={loading}
        onViewAssignment={handleOpenViewAssignment}
        onAssign={handleOpenAssign}
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

      {/* View assignments modal */}
        <ViewGradingSessionAssignments
          gradingSessionId={viewAssignmentGradingSessionSelected}
          isOpen={viewAssignmentModalOpen}
          onClose={handleCloseViewAssignment}
        />
    {/* Assign modal */}
        <AssignGradingModal
          gradingSessionId={assignGradingSessionSelected}
          isOpen={assignModalOpen}
          onClose={handleCloseAssign}
          onRefresh={refresh}
        />
    </div>
  )
}