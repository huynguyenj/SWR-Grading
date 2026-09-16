import { useState } from 'react'
import { FiArrowLeft, FiCpu, FiDownload } from 'react-icons/fi'
import FilePreviewModal from './FilePreviewModal'
import type { ParsedSubmission } from './SubmissionFilesZone'
import type { GradingLog, SubmissionFolder } from '../types/grading-exam.type'
import GradingLogStatusBadge from './GradingLogStatusBadge'
import ReferenceFilesSection from './ReferenceFileSection'
import SubmissionUploadDropzone from './SubmissionFilesZone'
import SubmissionFilesTable from './SubmissionFilesTable'
import FileGradingDetailModal from './FileGradingDetailModal'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const sampleAiLogTemplate = [
  'Đang giải nén và đọc cấu trúc folder bài làm...',
  'Đối chiếu bài làm với rubric chấm điểm...',
  'Kiểm tra tiêu chí 1: Đặc tả yêu cầu',
  'Kiểm tra tiêu chí 2: Mô hình hóa & thiết kế',
  'Kiểm tra tiêu chí 3: Trình bày & định dạng',
  'Không phát hiện dấu hiệu đạo văn đáng kể.',
  'Tổng hợp điểm và tạo nhận xét tự động...',
]

function randomScore() {
  // ~15% khả năng ra điểm 0 để minh họa tính năng highlight
  if (Math.random() < 0.15) return 0
  return Math.round((Math.random() * 4 + 6) * 10) / 10 // 6.0 - 10.0
}

interface GradingLogDetailViewProps {
  log: GradingLog
  onBack: () => void
  /** Cập nhật lại nhật ký hiện tại — cha (GradingPage) chịu trách nhiệm ghi vào state `logs` */
  onUpdateLog: (updater: (log: GradingLog) => GradingLog) => void
}

/**
 * Màn hình chi tiết 1 nhật ký chấm điểm: upload bài làm, chạy AI Grading,
 * theo dõi tiến độ/điểm từng bài nộp, xem chi tiết + chấm lại, xuất Excel.
 * Toàn bộ logic của riêng màn hình này (isGrading, viewingFolder...) sống ở đây,
 * chỉ ghi thay đổi dữ liệu ra ngoài qua `onUpdateLog`.
 */
export default function GradingLogDetailView({
  log,
  onBack,
  onUpdateLog,
}: GradingLogDetailViewProps) {
  const [viewingFolder, setViewingFolder] = useState<SubmissionFolder | null>(null)
  const [previewFile, setPreviewFile] = useState<{ label: string; objectKey: string } | null>(
    null,
  )
  const [isGrading, setIsGrading] = useState(false)

  function updateFolder(folderId: string, updater: (folder: SubmissionFolder) => SubmissionFolder) {
    onUpdateLog((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => (f.id === folderId ? updater(f) : f)),
    }))
  }

  function handleFilesSelected(parsed: ParsedSubmission[]) {
    const newFolders: SubmissionFolder[] = parsed.map((p) => ({
      id: crypto.randomUUID(),
      fileName: p.fileName,
      fileSizeLabel: p.fileSizeLabel,
      status: 'not_graded',
      score: null,
      aiLogs: [],
      comment: '',
    }))
    onUpdateLog((prev) => ({ ...prev, folders: [...prev.folders, ...newFolders] }))
  }

  async function handleAIGrading() {
    if (isGrading) return
    const targets = log.folders.filter((f) => f.status !== 'graded')
    if (targets.length === 0) return

    setIsGrading(true)
    onUpdateLog((prev) => ({ ...prev, status: 'in_progress' }))

    for (const folder of targets) {
      updateFolder(folder.id, (f) => ({ ...f, status: 'grading' }))
      await delay(700)
      const score = randomScore()
      updateFolder(folder.id, (f) => ({
        ...f,
        status: 'graded',
        score,
        aiLogs: sampleAiLogTemplate,
        comment:
          score === 0
            ? 'AI không thể chấm điểm do thiếu tài liệu bắt buộc hoặc bài làm không hợp lệ.'
            : 'Bài làm đáp ứng các tiêu chí trong rubric chấm điểm.',
      }))
    }

    onUpdateLog((prev) => ({ ...prev, status: 'completed' }))
    setIsGrading(false)
  }

  function handleSaveRegrade(folderId: string, score: number, comment: string) {
    updateFolder(folderId, (f) => ({ ...f, score, comment }))
  }

  const gradedCount = log.folders.filter((f) => f.status === 'graded').length
  const totalCount = log.folders.length
  const canExport = log.status === 'completed' && totalCount > 0

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
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-text-primary">{log.name}</h1>
            <GradingLogStatusBadge status={log.status} />
          </div>
          {log.examSessionName && (
            <p className="mt-1 text-sm text-text-secondary">
              Học kì {log.examSessionName}
            </p>
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
              {gradedCount}/{totalCount} folder
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
      <div className='flex gap-3'>
            {/* Upload file bài làm */}
            <div className='flex-3'>
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">Upload bài làm</h3>
                  <SubmissionUploadDropzone onFilesSelected={handleFilesSelected} />
            </div>
            {/* Tài liệu tham khảo: đề thi / rubric / đáp án */}
            <div>
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">Tài liệu tham khảo</h3>
                  <ReferenceFilesSection
                        examPaperFile={log.examPaperFile}
                        rubricFile={log.rubricFile}
                        answerFile={log.answerFile}
                        // onFileClick={(label, file) => setPreviewFile({ label, objectKey })}
                  />
            </div>

      </div>

      {/* Danh sách bài nộp */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Danh sách bài nộp</h3>
        <SubmissionFilesTable folders={log.folders} onView={setViewingFolder} />
      </div>
      
      <FileGradingDetailModal
        folder={viewingFolder}
        onClose={() => setViewingFolder(null)}
        onSaveRegrade={handleSaveRegrade}
      />

      <FilePreviewModal data={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  )
}