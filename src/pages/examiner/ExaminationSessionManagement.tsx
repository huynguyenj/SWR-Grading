
import Pagination from '@/components/ui/pagination'
import useGetExaminationSessionList from '@/features/admin/management/examination/hooks/useGetExaminationSessionList'
import ExaminationSessionTable from '@/features/examiner/management/examination/components/ExaminationSessionTable'
import UploadStudentSubmissionModal from '@/features/examiner/management/examination/components/UploadStudentSubmissionModal'
import { useState } from 'react'


export default function ExaminationSessionManagement() {
  const {
    examinationSessionDataList,
    loading,
    currentExaminationSessionPage,
    pageExaminationSessionSize,
    setCurrentExaminationSessionPage,
    setPageExaminationSessionSize,
    refresh
  } = useGetExaminationSessionList()
  const [uploadSelectedSession, setUploadSelectedSession] = useState<string>('')  
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const handleSelectUploadSession = (examSessionId: string) => {
    setUploadSelectedSession(examSessionId)
    setUploadModalOpen(true)
  }
  const handleCloseUploadSession = () => {
    setUploadSelectedSession('')
    setUploadModalOpen(false)
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
        <UploadStudentSubmissionModal
          examinationSessionId={uploadSelectedSession}
          isOpen={uploadModalOpen}
          onClose={handleCloseUploadSession}
          refresh={refresh}
        />
    </div>
  )
}
