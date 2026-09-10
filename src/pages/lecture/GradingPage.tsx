import CreateGradingLogModal from '@/features/lecturer/grading_exam/components/CreateGradingModal'
import GradingLogsTable from '@/features/lecturer/grading_exam/components/GradingLogsTable'
import GradingLogStatusBadge from '@/features/lecturer/grading_exam/components/GradingLogStatusBadge'
import type { ParsedSubmission } from '@/features/lecturer/grading_exam/components/SubmissionFilesZone'
import SubmissionUploadDropzone from '@/features/lecturer/grading_exam/components/SubmissionFilesZone'
import { mockGradingLogs, type GradingLog, type SubmissionFolder } from '@/features/lecturer/grading_exam/types/grading-exam.type'
import { useState } from 'react'
import { FiArrowLeft, FiCpu, FiDownload, FiPlus } from 'react-icons/fi'
import SubmissionFilesTable from '@/features/lecturer/grading_exam/components/SubmissionFilesTable'
import FileGradingDetailModal from '@/features/lecturer/grading_exam/components/FileGradingDetailModal'
import Button from '@/components/ui/button'


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

export default function GradingPage() {
  const [logs, setLogs] = useState<GradingLog[]>(mockGradingLogs)
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewingFolder, setViewingFolder] = useState<SubmissionFolder | null>(null)
  const [isGrading, setIsGrading] = useState(false)

  const selectedLog = logs.find((l) => l.id === selectedLogId) ?? null

  function updateLog(logId: string, updater: (log: GradingLog) => GradingLog) {
    setLogs((prev) => prev.map((l) => (l.id === logId ? updater(l) : l)))
  }

  function updateFolder(
    logId: string,
    folderId: string,
    updater: (folder: SubmissionFolder) => SubmissionFolder,
  ) {
    updateLog(logId, (log) => ({
      ...log,
      folders: log.folders.map((f) => (f.id === folderId ? updater(f) : f)),
    }))
  }

  function handleCreateLog(log: GradingLog) {
    setLogs((prev) => [log, ...prev])
  }

  function handleFilesSelected(parsed: ParsedSubmission[]) {
    if (!selectedLog) return
    const newFolders: SubmissionFolder[] = parsed.map((p) => ({
      id: crypto.randomUUID(),
      fileName: p.fileName,
      fileSizeLabel: p.fileSizeLabel,
      status: 'not_graded',
      score: null,
      aiLogs: [],
      comment: '',
    }))
    updateLog(selectedLog.id, (log) => ({ ...log, folders: [...log.folders, ...newFolders] }))
  }

  async function handleAIGrading() {
    if (!selectedLog || isGrading) return
    const targets = selectedLog.folders.filter((f) => f.status !== 'graded')
    if (targets.length === 0) return

    setIsGrading(true)
    updateLog(selectedLog.id, (log) => ({ ...log, status: 'in_progress' }))

    for (const folder of targets) {
      updateFolder(selectedLog.id, folder.id, (f) => ({ ...f, status: 'grading' }))
      await delay(700)
      const score = randomScore()
      updateFolder(selectedLog.id, folder.id, (f) => ({
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

    updateLog(selectedLog.id, (log) => ({ ...log, status: 'completed' }))
    setIsGrading(false)
  }

  function handleSaveRegrade(folderId: string, score: number, comment: string) {
    if (!selectedLog) return
    updateFolder(selectedLog.id, folderId, (f) => ({ ...f, score, comment }))
  }

  // ================= LIST VIEW =================
  if (!selectedLog) {
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Chấm điểm</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Tạo nhật ký chấm điểm, upload bài làm và chấm điểm bằng AI.
            </p>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
          >
            <FiPlus className="w-4 h-4" />
            Tạo nhật ký
          </Button>
        </div>

        <GradingLogsTable logs={logs} onOpen={(log) => setSelectedLogId(log.id)} />

        <CreateGradingLogModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateLog}
        />
      </div>
    )
  }

  // ================= DETAIL VIEW =================
  const gradedCount = selectedLog.folders.filter((f) => f.status === 'graded').length
  const totalCount = selectedLog.folders.length
  const canExport = selectedLog.status === 'completed' && totalCount > 0

  return (
    <div className="space-y-5">
      <button
        onClick={() => setSelectedLogId(null)}
        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-text-primary">{selectedLog.name}</h1>
            <GradingLogStatusBadge status={selectedLog.status} />
          </div>
          {selectedLog.examSessionName && (
            <p className="mt-1 text-sm text-text-secondary">
              Đợt thi liên quan: {selectedLog.examSessionName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAIGrading}
            disabled={isGrading || totalCount === 0 || gradedCount === totalCount}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiCpu className="w-4 h-4" />
            {isGrading ? 'Đang chấm điểm...' : 'AI Grading'}
          </Button>

          <Button
            variant='basic'
            disabled={!canExport}
            title={canExport ? 'Xuất Excel' : 'Cần hoàn thành chấm điểm trước'}
          >
            <FiDownload className="w-4 h-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Tiến độ chấm điểm */}
      {totalCount > 0 && (
        <div className="rounded-md border border-border-default bg-bg-primary p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-text-secondary">Tiến độ chấm điểm</span>
            <span className="font-medium text-text-primary">
              {gradedCount}/{totalCount} file
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

      {/* Danh sách bài nộp */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">
          Danh sách bài nộp
        </h3>
        <SubmissionFilesTable folders={selectedLog.folders} onView={setViewingFolder} />
      </div>

      <FileGradingDetailModal
        folder={viewingFolder}
        onClose={() => setViewingFolder(null)}
        onSaveRegrade={handleSaveRegrade}
      />
    </div>
  )
}