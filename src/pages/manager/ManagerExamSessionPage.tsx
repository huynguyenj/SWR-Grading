import Pagination from "@/components/ui/pagination"
import useGetExaminationSessionList from "@/features/admin/management/examination/hooks/useGetExaminationSessionList"
import ManagerExamSessionTable from "@/features/manager/examination_session/components/ManagerExamSessionTable"
import CreateGradingSessionModal from "@/features/manager/grading_session/components/CreateGradingSessionModal"
import { useState } from "react"

export default function ManagerExamSessionPage() {
  const {
    examinationSessionDataList,
    loading,
    currentExaminationSessionPage,
    pageExaminationSessionSize,
    setCurrentExaminationSessionPage,
    setPageExaminationSessionSize,
    refresh
  } = useGetExaminationSessionList()
  const [createSelectedSession, setCreateSelectedSession] = useState<string>('')  
  const [createGradingSessionOpen, setCreateGradingSessionOpen] = useState(false)
  const handleOpenGradingSession = (examSessionId: string) => {
    setCreateSelectedSession(examSessionId)
    setCreateGradingSessionOpen(true)
  }
  const handleCloseGradingSession = () => {
    setCreateSelectedSession('')
    setCreateGradingSessionOpen(false)
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
      <ManagerExamSessionTable
        sessions={examinationSessionDataList?.items}
        loading={loading}
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
      <CreateGradingSessionModal
        examinationSessionId={createSelectedSession}
        isOpen={createGradingSessionOpen}
        onClose={handleCloseGradingSession}
        refresh={refresh}
      />
    </div>
  )
}
