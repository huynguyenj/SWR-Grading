import { useMemo, useState } from 'react'

import Pagination from '@/components/ui/pagination'
import useGetExaminationSessionList from '@/features/admin/management/examination/hooks/useGetExaminationSessionList'
import type { ExaminationSessionType } from '@/features/examiner/management/examination/types/exam_session'
import ExaminationSessionTable from '@/features/examiner/management/examination/components/ExaminationSessionTable'
import ExaminationSessionDetailModal from '@/features/manager/examination_session/components/ManagerExamSessionDetailModal'
import UpdateExaminationSessionModal from '@/features/examiner/management/examination/components/UpdateExaminationSessionModal'
import UploadStudentSubmissionModal from '@/features/examiner/management/examination/components/UploadStudentSubmissionModal'

const ExaminationSessionManagement = () => {
  const {
    examinationSessionDataList,
    loading,
    currentExaminationSessionPage,
    pageExaminationSessionSize,
    setCurrentExaminationSessionPage,
    setPageExaminationSessionSize,
    refresh,
  } = useGetExaminationSessionList()

  // Selected session
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  )

  // Detail modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  // Upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const sessions = useMemo(
    () => examinationSessionDataList?.items ?? [],
    [examinationSessionDataList?.items],
  )

  const selectedSession = useMemo<ExaminationSessionType | undefined>(
    () =>
      sessions.find(
        (session) =>
          session.examinationSessionId === selectedSessionId,
      ),
    [sessions, selectedSessionId],
  )

  // Open detail modal
  const handleViewDetail = (examinationSessionId: string) => {
    setSelectedSessionId(examinationSessionId)
    setIsDetailModalOpen(true)
  }

  // Open update modal
  const handleEditSession = (examinationSessionId: string) => {
    setSelectedSessionId(examinationSessionId)
    setIsUpdateModalOpen(true)
  }

  // Open upload modal
  const handleUploadSession = (examinationSessionId: string) => {
    setSelectedSessionId(examinationSessionId)
    setIsUploadModalOpen(true)
  }

  // Close all modals and clear selected session
  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setIsUpdateModalOpen(false)
    setIsUploadModalOpen(false)
    setSelectedSessionId(null)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-text-primary">
          Quản lý đợt thi
        </h1>

        <p className="text-sm text-text-secondary">
          Quản lý thông tin, trạng thái và bài nộp của các đợt thi.
        </p>
      </div>

      {/* Session table */}
      <ExaminationSessionTable
        sessions={sessions}
        loading={loading}
        onViewDetail={handleViewDetail}
        onEditSession={handleEditSession}
        onUploadSelectedSession={handleUploadSession}
      />

      {/* Pagination */}
      {examinationSessionDataList && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentExaminationSessionPage}
            totalPages={examinationSessionDataList.totalPages}
            pageSize={pageExaminationSessionSize}
            onPageChange={setCurrentExaminationSessionPage}
            onPageSizeChange={setPageExaminationSessionSize}
          />
        </div>
      )}

      {/* Detail modal */}
      <ExaminationSessionDetailModal
        session={selectedSession}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />

      {/* Update modal */}
      <UpdateExaminationSessionModal
        open={isUpdateModalOpen}
        onClose={handleCloseModal}
        onRefresh={refresh}
        session={selectedSession}
      />

      {/* Upload submission modal */}
      {selectedSessionId && (
        <UploadStudentSubmissionModal
          examinationSessionId={selectedSessionId}
          isOpen={isUploadModalOpen}
          onClose={handleCloseModal}
          refresh={refresh}
        />
      )}
    </div>
  )
}

export default ExaminationSessionManagement