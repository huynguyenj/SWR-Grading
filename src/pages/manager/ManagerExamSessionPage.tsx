import { useState } from 'react'

import Pagination from '@/components/ui/pagination'

import useGetExaminationSessionList from '@/features/admin/management/examination/hooks/useGetExaminationSessionList'

import ManagerExamSessionTable from '@/features/manager/examination_session/components/ManagerExamSessionTable'

import CreateGradingSessionModal from '@/features/manager/grading_session/components/CreateGradingSessionModal'
import ExaminationSessionDetailModal from '@/features/manager/examination_session/components/ManagerExamSessionDetailModal'

export default function ManagerExamSessionPage() {
  const {
    examinationSessionDataList,
    loading,
    currentExaminationSessionPage,
    pageExaminationSessionSize,
    setCurrentExaminationSessionPage,
    setPageExaminationSessionSize,
    refresh,
  } = useGetExaminationSessionList()

  // View examination session detail modal
  const [viewDetailModalOpen, setViewDetailModalOpen] = useState(false)
  const [viewDetailSessionSelected, setViewDetailSessionSelected] =
    useState('')

  // Create grading session modal
  const [createGradingSessionOpen, setCreateGradingSessionOpen] =
    useState(false)

  const [createSelectedSession, setCreateSelectedSession] = useState('')

  // Open detail modal
  const handleOpenViewDetail = (examSessionId: string) => {
    setViewDetailSessionSelected(examSessionId)
    setViewDetailModalOpen(true)
  }

  // Close detail modal
  const handleCloseViewDetail = () => {
    setViewDetailModalOpen(false)
    setViewDetailSessionSelected('')
  }

  // Open create grading session modal
  const handleOpenGradingSession = (examSessionId: string) => {
    setCreateSelectedSession(examSessionId)
    setCreateGradingSessionOpen(true)
  }

  // Close create grading session modal
  const handleCloseGradingSession = () => {
    setCreateSelectedSession('')
    setCreateGradingSessionOpen(false)
  }

  // Find selected examination session
  const selectedExaminationSession =
    examinationSessionDataList?.items.find(
      (session) =>
        session.examinationSessionId === viewDetailSessionSelected,
    )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Các đợt thi
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Theo dõi các đợt thi, kỳ thi và học kỳ tương ứng.
        </p>
      </div>

      {/* Examination session table */}
      <ManagerExamSessionTable
        sessions={examinationSessionDataList?.items}
        loading={loading}
        onViewDetail={handleOpenViewDetail}
        onCreateGradingSession={handleOpenGradingSession}
      />

      {/* Pagination */}
      {examinationSessionDataList &&
        examinationSessionDataList.totalPages > 0 && (
          <Pagination
            currentPage={currentExaminationSessionPage}
            onPageChange={setCurrentExaminationSessionPage}
            totalPages={examinationSessionDataList.totalPages}
            onPageSizeChange={(size) => {
              setPageExaminationSessionSize(size)
              setCurrentExaminationSessionPage(1)
            }}
            pageSize={pageExaminationSessionSize}
          />
        )}

      {/* View examination session detail modal */}
      <ExaminationSessionDetailModal
        session={selectedExaminationSession}
        isOpen={viewDetailModalOpen}
        onClose={handleCloseViewDetail}
      />

      {/* Create grading session modal */}
      <CreateGradingSessionModal
        examinationSessionId={createSelectedSession}
        isOpen={createGradingSessionOpen}
        onClose={handleCloseGradingSession}
        refresh={refresh}
      />
    </div>
  )
}