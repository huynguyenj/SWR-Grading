import { useState } from 'react'
import { FiArrowLeft, FiDownload, FiFileText, FiUser } from 'react-icons/fi'
import useGetGradingDiaryDetail from '../hooks/useGetGradingDiaryDetail'
import useUploadSubmissionFiles from '../hooks/useUploadSubmissionFiles'
import type { SubmissionType } from '../types/submission.type'
import SubmissionFilesTable from './SubmissionFilesTable'
import FileGradingDetailModal from './FileGradingDetailModal'
import PaperSetDocumentsModal from './PaperDocumentModal'
import DiarySubmissionUploadZone from './DiarySubmissionUploadZone'
import Button from '@/components/ui/button'
import { exportSubmissionsToExcel } from '../utils/submission_excel'

interface GradingLogDetailViewProps {
  diaryId: string
  diaryName: string
  onBack: () => void
}

export default function GradingLogDetailView({
  diaryId,
  diaryName,
  onBack,
}: GradingLogDetailViewProps) {
  const { diaryDetail, loading, refresh } = useGetGradingDiaryDetail({ diaryId })
  const [viewingSubmission, setViewingSubmission] = useState<SubmissionType | null>(null)
  const [documentsPaperSetId, setDocumentsPaperSetId] = useState<string | null>(null)
  // const { execute: executeAiGrading, loading: isGrading } = useApiCall()
  const { handleUploadSubmissionFiles, loading: isUploading } = useUploadSubmissionFiles()

  const submissions = diaryDetail?.submissions ?? []
  const totalCount = submissions.length
  // Status '0' = mới nộp, chưa qua AI chấm
  const gradedCount = submissions.filter((s) => s.status !== '0').length
  const canExport = totalCount > 0 && gradedCount === totalCount

  // async function handleAIGrading() {
  //   const response = await executeAiGrading({
  //     apiUrl: `/grading-diaries/${diaryId}/ai-grading`,
  //     method: 'post',
  //     type: 'private',
  //   })
  //   if (response.error) {
  //     toast.error(response.error.message)
  //     return
  //   }
  //   toast.success('Đã bắt đầu chấm điểm bằng AI')
  //   refresh()
  // }

  async function handleUploadFiles(files: File[]) {
    const success = await handleUploadSubmissionFiles(diaryId, files)
    if (success) refresh()
    return success
  }

   
  function handleExportExcel() {
    exportSubmissionsToExcel(submissions, `${diaryDetail?.name ?? diaryName}_${diaryDetail?.paperSetCode}.xlsx`)
  }

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-text-primary">
            {diaryDetail?.name ?? diaryName}
          </h1>

          {diaryDetail?.content && (
            <p className="mt-1 text-sm text-text-secondary">{diaryDetail.content}</p>
          )}

          {diaryDetail && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <FiFileText className="w-3.5 h-3.5" />
                Bộ đề: {diaryDetail.paperSetCode}
              </span>
              <span className="flex items-center gap-1.5">
                <FiUser className="w-3.5 h-3.5" />
                Giảng viên: {diaryDetail.lecturerName}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* <Button
            onClick={handleAIGrading}
            disabled={isGrading || totalCount === 0 || gradedCount === totalCount}
          >
            <FiCpu className="w-4 h-4" />
            {isGrading ? 'Đang chấm điểm...' : 'AI Grading'}
          </Button> */}

          <button
            onClick={handleExportExcel}
            disabled={!canExport}
            title={canExport ? 'Xuất Excel' : 'Cần hoàn thành chấm điểm trước'}
            className="flex items-center gap-2 rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiDownload className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Tiến độ chấm điểm */}
      {totalCount > 0 && (
        <div className="rounded-md border border-border-default bg-bg-primary p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-secondary">Tiến độ chấm điểm</span>
            <span className="font-medium text-text-primary">
              {gradedCount}/{totalCount} bài nộp
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-orange transition-all duration-300"
              style={{ width: `${(gradedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload file bài làm + Tài liệu */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Upload */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Upload bài làm</h3>
          <DiarySubmissionUploadZone onUpload={handleUploadFiles} uploading={isUploading} />
        </div>

        {/* Tài liệu */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Tài liệu</h3>
          <div className="flex items-center justify-between gap-3 rounded-md border border-border-default bg-bg-primary p-4">
            <div className="min-w-0">
              <p className="text-sm text-text-primary">Đề, rubric và template của bộ đề này</p>
              {diaryDetail?.paperSetCode && (
                <p className="mt-0.5 text-xs text-text-muted">Bộ đề: {diaryDetail.paperSetCode}</p>
              )}
            </div>
            <Button
              onClick={() => diaryDetail && setDocumentsPaperSetId(diaryDetail.paperSetId)}
              disabled={!diaryDetail?.paperSetId}
              variant='basic'
            >
              Xem tài liệu
            </Button>
          </div>
        </div>
      </div>

      {/* Danh sách bài nộp */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Danh sách bài nộp</h3>
        {loading ? (
          <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
            <p className="text-sm text-text-muted">Đang tải danh sách bài nộp...</p>
          </div>
        ) : (
          <SubmissionFilesTable submissions={submissions} onView={setViewingSubmission} />
        )}
      </div>

      <FileGradingDetailModal
        submission={viewingSubmission}
        onClose={() => setViewingSubmission(null)}
        onSaved={refresh}
      />

      <PaperSetDocumentsModal
        paperSetId={documentsPaperSetId}
        onClose={() => setDocumentsPaperSetId(null)}
      />
    </div>
  )
}