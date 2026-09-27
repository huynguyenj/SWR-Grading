import { useEffect, useState } from 'react'
import { FiArrowLeft, FiCpu, FiDownload } from 'react-icons/fi'
import { toast } from 'react-toastify'
import useApiCall from '@/hooks/useApiCall'
import useGetGradingDiaryDetail from '../hooks/useGetGradingDiaryDetail'
import type { SubmissionDetail } from '../types/grading-exam.type'
import SubmissionUploadDropzone from './SubmissionFilesZone'
import SubmissionFilesTable from './SubmissionFilesTable'
import FileGradingDetailModal from './FileGradingDetailModal'

interface GradingLogDetailViewProps {
  diaryId: string
  diaryName: string
  onBack: () => void
}

/**
 * Màn hình chi tiết 1 nhật ký chấm điểm — component ĐỘC LẬP, tự fetch dữ liệu
 * qua `diaryId` thay vì nhận nguyên object + callback mutate từ cha (khác bản cũ
 * dùng data mock). Cha chỉ cần biết đang xem nhật ký nào (`diaryId`/`diaryName`).
 */
export default function GradingLogDetailView({
  diaryId,
  diaryName,
  onBack,
}: GradingLogDetailViewProps) {
  const { listSubmission, loading, handleGetListSubmission } = useGetGradingDiaryDetail()
  const [viewingSubmission, setViewingSubmission] = useState<SubmissionDetail | null>(null)
  const { execute: executeAiGrading, loading: isGrading } = useApiCall()

  useEffect(() => {
    handleGetListSubmission(diaryId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryId])

  const submissions = listSubmission ?? []
  const gradedCount = submissions.filter((s) => s.status !== '0').length
  const totalCount = submissions.length
  const canExport = totalCount > 0 && submissions.every((s) => s.status !== '0')

  // GIẢ ĐỊNH endpoint — chưa được cung cấp, cần xác nhận lại route thật với BE
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
    handleGetListSubmission(diaryId)
  }

  // Chưa có endpoint upload bài nộp thật — để rõ TODO thay vì giả lập thêm dữ liệu cục bộ
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
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{diaryName}</h1>
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
              style={{ width: `${totalCount === 0 ? 0 : (gradedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload file bài làm */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Upload bài làm</h3>
        <SubmissionUploadDropzone onFilesSelected={handleFilesSelected} />
      </div>

      {/*
        TODO: "Tài liệu tham khảo" (đề/rubric/đáp án) đã bỏ tạm — SubmissionDetail
        không có field file đề/rubric/đáp án. Cần API riêng lấy file theo paperSetId
        của nhật ký này rồi mới hiển thị lại được đúng dữ liệu thật.
      */}

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
        onSaved={() => handleGetListSubmission(diaryId)}
      />
    </div>
  )
}