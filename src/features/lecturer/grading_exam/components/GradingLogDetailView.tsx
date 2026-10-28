import { useState } from 'react'
import { FiArrowLeft, FiCpu, FiDownload, FiFileText, FiList, FiUser } from 'react-icons/fi'
import useGetGradingDiaryDetail from '../hooks/useGetGradingDiaryDetail'
import useUploadSubmissionFiles from '../hooks/useUploadSubmissionFiles'
import type { SubmissionType } from '../types/submission.type'
import SubmissionFilesTable from './SubmissionFilesTable'
import FileGradingDetailModal from './FileGradingDetailModal'
import PaperSetDocumentsModal from './PaperDocumentModal'
import PaperRubricModal from './PaperRubricModal'
import DocumentCard from './DocumentCard'
import { exportSubmissionsToExcel } from '../utils/submission_excel'
import useAiGrade from '../hooks/useAiGrade'
import Button from '@/components/ui/button'
import DiarySubmissionUploadZoneV2 from './DiarySubmissionUploadZoneV2'

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
  const [rubricPaperSetId, setRubricPaperSetId] = useState<string | null>(null)
  // const { execute: executeAiGrading, loading: isGrading } = useApiCall()
  const { handleUploadSubmissionFiles, loading: isUploading } = useUploadSubmissionFiles()
  const { handleAiGrading, isGrading } = useAiGrade({ onRefresh: refresh })
  const submissions = diaryDetail?.submissions ?? []
  const totalCount = submissions.length
  // Status '0' = mới nộp, chưa qua AI chấm
  const gradedCount = submissions.filter((s) => String(s.status) !== '0').length
  
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

  async function handleUploadFiles(files: File) {
    const success = await handleUploadSubmissionFiles(diaryId, files)
    if (success) refresh()
    return success
  }

  function handleExportExcel() {
    exportSubmissionsToExcel(submissions, `${diaryDetail?.name ?? diaryName}_${diaryDetail?.paperSetCode}.xlsx`)
  }

  const paperSetLabel = diaryDetail?.paperSetCode ? `Bộ đề ${diaryDetail.paperSetCode}` : ''
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
          <Button
            onClick={() => handleAiGrading(diaryDetail?.submissions)}
            disabled={ isGrading || totalCount === 0 || gradedCount === totalCount}
          >
            <FiCpu className="w-4 h-4" />
            {isGrading ? 'Đang chấm điểm...' : 'AI Grading'}
          </Button>

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
          <DiarySubmissionUploadZoneV2 onUpload={handleUploadFiles} uploading={isUploading} />
        </div>

        {/* Tài liệu: file đề + rubric */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Tài liệu</h3>
          <div className="space-y-3">
            <DocumentCard
              icon={FiFileText}
              title="File đề"
              description={`Nội dung các câu hỏi${paperSetLabel ? ` · ${paperSetLabel}` : ''}`}
              buttonLabel="Xem file đề"
              onView={() => diaryDetail && setDocumentsPaperSetId(diaryDetail.paperSetId)}
              disabled={!diaryDetail?.paperSetId}
            />
            <DocumentCard
              icon={FiList}
              title="Rubric"
              description={`Tiêu chí và thang điểm chi tiết${paperSetLabel ? ` · ${paperSetLabel}` : ''}`}
              buttonLabel="Xem rubric"
              onView={() => diaryDetail && setRubricPaperSetId(diaryDetail.paperSetId)}
              disabled={!diaryDetail?.paperSetId}
            />
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

      <PaperRubricModal paperSetId={rubricPaperSetId} onClose={() => setRubricPaperSetId(null)} />
    </div>
  )
}