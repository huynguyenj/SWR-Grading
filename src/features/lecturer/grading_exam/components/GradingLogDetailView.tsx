import { useEffect, useState } from 'react'
import { FiArrowLeft, FiCpu, FiDownload, FiFileText, FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'
import useApiCall from '@/hooks/useApiCall'
import useGetGradingDiaryDetail from '../hooks/useGetGradingDiaryDetail'
import type { SubmissionType } from '../types/submission.type'
import SubmissionUploadDropzone from './SubmissionFilesZone'
import SubmissionFilesTable from './SubmissionFilesTable'
import FileGradingDetailModal from './FileGradingDetailModal'

interface GradingLogDetailViewProps {
  diaryId: string
  /** Chỉ dùng làm tiêu đề tạm trong lúc đang tải chi tiết */
  diaryName: string
  onBack: () => void
}

export default function GradingLogDetailView({
  diaryId,
  diaryName,
  onBack,
}: GradingLogDetailViewProps) {
  const { diaryDetail, loading, handleGetDiaryDetail } = useGetGradingDiaryDetail()
  const [viewingSubmission, setViewingSubmission] = useState<SubmissionType | null>(null)
  const { execute: executeAiGrading, loading: isGrading } = useApiCall()

  useEffect(() => {
    handleGetDiaryDetail(diaryId)
  }, [diaryId])
  console.log(diaryDetail);
  
  const submissions = diaryDetail?.submissions ?? []
  const totalCount = submissions.length
  // Status '0' = mới nộp, chưa qua AI chấm
  const gradedCount = submissions.filter((s) => s.status !== '0').length
  const canExport = totalCount > 0 && gradedCount === totalCount

  async function handleAIGrading() {
    const response = await executeAiGrading({
      apiUrl: `/grading-diaries/${diaryId}/ai-grading`,
      method: 'post',
      type: 'private',
    })
    if (response.error) {
      toast.error(response.error.message)
      return
    }
    toast.success('Đã bắt đầu chấm điểm bằng AI')
    handleGetDiaryDetail(diaryId)
  }

  // Chưa có endpoint upload bài nộp thật
  function handleFilesSelected() {
    toast.info('Chưa nối API upload bài nộp thật — cần bổ sung endpoint từ BE.')
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
          <button
            onClick={handleAIGrading}
            disabled={isGrading || totalCount === 0 || gradedCount === totalCount}
            className="flex items-center gap-2 rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-rust transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiCpu className="w-4 h-4" />
            {isGrading ? 'Đang chấm điểm...' : 'AI Grading'}
          </button>

          <button
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

      {/* Upload file bài làm */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Upload bài làm</h3>
        <SubmissionUploadDropzone onFilesSelected={handleFilesSelected} />
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
        onSaved={() => handleGetDiaryDetail(diaryId)}
      />
    </div>
  )
}