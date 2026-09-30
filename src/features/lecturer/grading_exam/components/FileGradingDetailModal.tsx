import { useState, useEffect, useMemo } from 'react'
import { FiTerminal, FiEdit3, FiAlertTriangle } from 'react-icons/fi'
import type { CriterionScore, SubmissionType } from '../types/submission.type'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import useUpdateSubmissionScore from '../hooks/useUpdateSubmissionScore'
import useGetGradingSubmissionDetail from '../hooks/useGetGradingSubmissionDetail'
import useFinalizeScore from '../hooks/useFinalizeGrade'

interface FileGradingDetailModalProps {
  /** Chỉ cần đủ để biết đang mở submission nào — chi tiết đầy đủ modal tự fetch riêng */
  submission: SubmissionType | null
  onClose: () => void
  /** Gọi lại sau khi lưu điểm thành công — dùng để cha refetch danh sách/chi tiết nhật ký */
  onSaved: () => void
}

/** aiLogs là chuỗi JSON chứa breakdown đầy đủ hơn field `criteriaScores` phẳng
 *  (có thêm missing_items + overall_comment) — ưu tiên parse cái này nếu có */
interface ParsedAiLog {
  total_score: number
  criteria_scores: CriterionScore[]
  missing_items: string[]
  overall_comment: string
}

function parseAiLogs(raw: string | null): ParsedAiLog | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as ParsedAiLog
  } catch {
    return null
  }
}

export default function FileGradingDetailModal({
  submission,
  onClose,
  onSaved,
}: FileGradingDetailModalProps) {
  const [score, setScore] = useState('')
  const [comment, setComment] = useState('')
  const { updateScore, loading: saving } = useUpdateSubmissionScore()
  const { submissionDetail, loading, handleGetGradingDetail } = useGetGradingSubmissionDetail()
  const { finalizeScore, loading: loadingFinalize } = useFinalizeScore()
  // Mỗi khi mở 1 submission khác -> fetch lại chi tiết đầy đủ (aiLogs, criteriaScores, sinh viên...)
  useEffect(() => {
    if (submission) {
      handleGetGradingDetail(submission.submissionId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission?.submissionId])

  // Đồng bộ form điểm/nhận xét khi chi tiết vừa fetch xong
  useEffect(() => {
    const handleCheckScore = () => {
      if (submissionDetail) {
        const reviewed = String(submissionDetail.status) === '2' || String(submissionDetail.status) === '3'
        const currentScore = reviewed
          ? submissionDetail.lecturerScore ?? submissionDetail.aiScore
          : submissionDetail.aiScore
        setScore(currentScore?.toString() ?? '')
        setComment(submissionDetail.comment ?? '')
      }
    }
    handleCheckScore()
  }, [submissionDetail])

  const parsedAiLog = useMemo(
    () => parseAiLogs(submissionDetail?.aiLogs ?? null),
    [submissionDetail?.aiLogs],
  )
  // Ưu tiên breakdown từ aiLogs (đầy đủ hơn), fallback về criteriaScores phẳng nếu parse lỗi
  const criteriaScores = parsedAiLog?.criteria_scores ?? submissionDetail?.criteriaScores ?? []
  const missingItems = parsedAiLog?.missing_items ?? []
  const overallComment = parsedAiLog?.overall_comment

  if (!submission) return null

  async function handleSave() {
    if (!submissionDetail) return
    const parsedScore = Number(score)
    const success = await updateScore(
      submissionDetail.submissionId,
      Number.isNaN(parsedScore) ? 0 : parsedScore,
      comment,
    )
    if (success) {
      onSaved()
      onClose()
    }
  }
  const handleFinalize = async () => {
    if (!submissionDetail) return
    const isSuccess = await finalizeScore(submissionDetail?.submissionId)
    if (isSuccess) {
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
      {loading || !submissionDetail ? (
        <div className="py-16 text-center">
          <p className="text-sm text-text-muted">Đang tải chi tiết bài chấm...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-default">
          {/* ===== Bên trái: kết quả AI chi tiết ===== */}
          <div className="flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between gap-2 border-b border-border-default px-5 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <FiTerminal className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-primary">Kết quả chấm AI</h3>
              </div>
              <span className="text-xs text-text-muted">
                {submissionDetail.studentName} · {submissionDetail.studentCode}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-text-muted">Điểm AI</p>
                <p className="text-2xl font-semibold text-text-primary">
                  {submissionDetail.aiScore.toFixed(1)}
                  <span className="ml-1 text-sm font-normal text-text-muted">/ 10</span>
                </p>
              </div>

              {criteriaScores.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-text-muted">Điểm theo tiêu chí</p>
                  <ul className="space-y-2">
                    {criteriaScores.map((c, i) => (
                      <li key={i} className="rounded-md bg-bg-muted/50 px-3 py-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-text-primary">{c.criterion}</span>
                          <span className="shrink-0 text-sm font-semibold text-text-primary">
                            {c.actual_score}/{c.max_score}
                          </span>
                        </div>
                        {c.comment && (
                          <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                            {c.comment}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {missingItems.length > 0 && (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
                    <FiAlertTriangle className="w-3.5 h-3.5" />
                    Thiếu sót cần lưu ý
                  </p>
                  <ul className="space-y-1">
                    {missingItems.map((item, i) => (
                      <li
                        key={i}
                        className="rounded-md bg-danger/5 px-3 py-1.5 text-xs text-text-secondary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {overallComment && (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-text-muted">Nhận xét tổng quan</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{overallComment}</p>
                </div>
              )}

              {criteriaScores.length === 0 && !overallComment && (
                <p className="rounded-md bg-bg-muted/50 px-3 py-2 text-xs text-text-muted">
                  Chưa có log chi tiết cho bài chấm này.
                </p>
              )}
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
              { submissionDetail.status != '3' &&
                <Button onClick={handleSave} disabled={saving} type="button">
                  {saving ? 'Đang lưu...' : 'Lưu điểm'}
                </Button>
              }
              <Button variant='danger' onClick={handleFinalize} disabled={loadingFinalize} type="button">
                {loadingFinalize ? 'Đang lưu...' : 'Chấp nhận kết quả'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}