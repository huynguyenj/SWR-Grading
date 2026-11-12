
import { useState } from 'react'

import Pagination from '@/components/ui/pagination'
import useGetExaminationSessionList from '@/features/admin/management/examination/hooks/useGetExaminationSessionList'
import ExaminationSessionTable from '@/features/examiner/management/examination/components/ExaminationSessionTable'
import UploadStudentSubmissionModal from '@/features/examiner/management/examination/components/UploadStudentSubmissionModal'
import ExaminationSessionDetailModal from '@/features/manager/examination_session/components/ManagerExamSessionDetailModal'

export default function ExaminationSessionManagement() {
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
  const [viewDetailSessionSelected, setViewDetailSessionSelected] = useState('')

  // Upload submission modal state
  const [uploadSelectedSession, setUploadSelectedSession] = useState('')

  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const selectedExaminationSession =
    examinationSessionDataList?.items.find(
      (session) =>
        session.examinationSessionId === viewDetailSessionSelected,
    )
  const handleSelectUploadSession = (examSessionId: string) => {
    setUploadSelectedSession(examSessionId)
    setUploadModalOpen(true)
  }

  const handleCloseUploadSession = () => {
    setUploadModalOpen(false)
    setUploadSelectedSession('')
  }

  const handleOpenViewDetail = (examSessionId: string) => {
    setViewDetailSessionSelected(examSessionId)
    setViewDetailModalOpen(true)
  }
  const handleCloseViewDetail = () => {
    setViewDetailModalOpen(false)
    setViewDetailSessionSelected('')
  }
  

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
      <ExaminationSessionTable
        sessions={examinationSessionDataList?.items}
        loading={loading}
        onUploadSelectedSession={handleSelectUploadSession}
        onViewDetail={handleOpenViewDetail}
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

      {/* Upload student submission modal */}
      <UploadStudentSubmissionModal
        examinationSessionId={uploadSelectedSession}
        isOpen={uploadModalOpen}
        onClose={handleCloseUploadSession}
        refresh={refresh}
      />
      {/* View examination session detail modal */}
      <ExaminationSessionDetailModal
         session={selectedExaminationSession}
         isOpen={viewDetailModalOpen}
         onClose={handleCloseViewDetail}
      />
    </div>
  )
}
