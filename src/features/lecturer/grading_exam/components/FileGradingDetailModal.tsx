import { useState, useEffect } from 'react'
import { FiTerminal, FiEdit3 } from 'react-icons/fi'
import type { SubmissionDetail } from '../types/grading-exam.type'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import useUpdateSubmissionScore from '../hooks/useUpdateSubmissionScore'

interface FileGradingDetailModalProps {
  submission: SubmissionDetail | null
  onClose: () => void
  /** Gọi lại sau khi lưu điểm thành công — dùng để cha refetch danh sách */
  onSaved: () => void
}

export default function FileGradingDetailModal({
  submission,
  onClose,
  onSaved,
}: FileGradingDetailModalProps) {
  const [score, setScore] = useState('')
  const [comment, setComment] = useState('')
  const { updateScore, loading } = useUpdateSubmissionScore()

  // Đồng bộ lại form mỗi khi mở 1 submission khác
  useEffect(() => {
    const handleUpdateSubmission = () => {
        if (submission) {
          setScore((submission.lecturerScore ?? submission.aiScore)?.toString() ?? '')
          setComment(submission.comment ?? '')
        }
    }
    handleUpdateSubmission()
  }, [submission])

  if (!submission) return null

  async function handleSave() {
    if (!submission) return
    const parsedScore = Number(score)
    const success = await updateScore(
      submission.submissionId,
      Number.isNaN(parsedScore) ? 0 : parsedScore,
      comment,
    )
    if (success) {
      onSaved()
      onClose()
    }
  }

  return (
    <Modal
      open={submission !== null}
      onClose={onClose}
      title={submission.submissionFile}
      maxWidth="full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-default">
        {/* ===== Bên trái: log AI + điểm theo tiêu chí ===== */}
        <div className="flex flex-col max-h-[70vh]">
          <div className="flex items-center gap-2 border-b border-border-default px-5 py-3 shrink-0">
            <FiTerminal className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-primary">Nhật ký chấm điểm AI</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {submission.criteriaScores.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-text-muted">Điểm theo tiêu chí</p>
                <ul className="space-y-1">
                  {submission.criteriaScores.map((c) => (
                    <li
                      key={c.criterionId}
                      className="flex items-center justify-between rounded-md bg-bg-muted/50 px-3 py-1.5 text-sm"
                    >
                      <span className="text-text-secondary">{c.criterionName}</span>
                      <span className="font-medium text-text-primary">{c.score.toFixed(1)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-xs font-medium text-text-muted">Log chi tiết</p>
              <p className="whitespace-pre-line font-mono text-xs text-text-secondary">
                {submission.aiLogs || 'Chưa có log.'}
              </p>
            </div>
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
                {submission.aiScore !== null ? submission.aiScore.toFixed(1) : '—'}
                <span className="ml-1 text-sm font-normal text-text-muted">/ 10</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Điểm chấm lại
              </label>
              <Input
                size="basic"
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
            <Button variant="basic" onClick={onClose} type="button">
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={loading} type="button">
              {loading ? 'Đang lưu...' : 'Lưu điểm'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}