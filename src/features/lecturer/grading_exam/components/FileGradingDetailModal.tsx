import  { useState, useEffect } from 'react'
import { FiTerminal, FiEdit3 } from 'react-icons/fi'
import type { SubmissionFolder } from '../types/grading-exam.type'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

interface FileGradingDetailModalProps {
  folder: SubmissionFolder | null
  onClose: () => void
  onSaveRegrade: (folderId: string, score: number, comment: string) => void
}

export default function FileGradingDetailModal({
  folder,
  onClose,
  onSaveRegrade,
}: FileGradingDetailModalProps) {
  const [score, setScore] = useState('')
  const [comment, setComment] = useState('')

  // Đồng bộ lại form mỗi khi mở 1 folder khác
  useEffect(() => {
    const handleScoreAndComment = () => {
      if (folder) {
      setScore(folder.score?.toString() ?? '')
      setComment(folder.comment ?? '')
    }
    }
    handleScoreAndComment()
  }, [folder])

  if (!folder) return null

  function handleSave() {
    if (!folder) return
    const parsedScore = Number(score)
    onSaveRegrade(folder.id, Number.isNaN(parsedScore) ? 0 : parsedScore, comment)
    onClose()
  }

  return (
    <Modal open={folder !== null} onClose={onClose} title={folder.fileName} maxWidth="full">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-default">
        {/* ===== Bên trái: logs AI đã chấm ===== */}
        <div className="flex flex-col max-h-[70vh]">
          <div className="flex items-center gap-2 border-b border-border-default px-5 py-3 shrink-0">
            <FiTerminal className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">Nhật ký chấm điểm AI</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="space-y-2 font-mono text-xs text-text-secondary">
              {folder.aiLogs.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-text-muted shrink-0">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== Bên phải: chấm lại + comment ===== */}
        <div className="flex flex-col max-h-[70vh]">
          <div className="flex items-center gap-2 border-b border-border-default px-5 py-3 shrink-0">
            <FiEdit3 className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">Chấm lại & nhận xét</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Điểm AI đã chấm
              </label>
              <p className="text-2xl font-semibold text-text-primary">
                {folder.score?.toFixed(1)}
                <span className="ml-1 text-sm font-normal text-text-muted">/ 10</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Điểm chấm lại
              </label>
              <Input
                size='basic'                
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Nhận xét
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="Nhận xét về bài làm..."
                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border-default px-5 py-3 shrink-0">
            <Button
              variant='basic'
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
            >
              Lưu điểm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}