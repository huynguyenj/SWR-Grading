import { useEffect, useMemo } from 'react'
import { FiTerminal, FiEdit3, FiAlertTriangle, FiTrash } from 'react-icons/fi'
import type { CriterionScore, SubmissionType } from '../types/submission.type'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import useUpdateSubmissionScore from '../hooks/useUpdateSubmissionScore'
import useGetGradingSubmissionDetail from '../hooks/useGetGradingSubmissionDetail'
import useFinalizeScore from '../hooks/useFinalizeGrade'
import LecturerGradingSection from './LecturerGradingSection'

interface FileGradingDetailModalProps {
  /** Chỉ cần đủ để biết đang mở submission nào — chi tiết đầy đủ modal tự fetch riêng */
  submission: SubmissionType | null
  onClose: () => void
  /** Gọi lại sau khi lưu điểm thành công — dùng để cha refetch danh sách/chi tiết nhật ký */
  onSaved: () => void
  onRefresh: () => void
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
  onRefresh: refreshListSubmission
}: FileGradingDetailModalProps) {
  const { submissionDetail, loading, handleGetGradingDetail, refresh: refreshSubmissionDetail } = useGetGradingSubmissionDetail()
  const { loading: saving, appendQuestionFix, questionFixField, removeQuestionFix, register, handleSubmit, onSubmit } = useUpdateSubmissionScore({ submissionId: submission?.submissionId, onRefreshSubmissionDetail: refreshSubmissionDetail, onRefreshListSubmission: refreshListSubmission})
  const { finalizeScore, loading: loadingFinalize } = useFinalizeScore()
  useEffect(() => {
    if (submission) {
      handleGetGradingDetail(submission.submissionId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission?.submissionId])


  const parsedAiLog = useMemo(
    () => parseAiLogs(submissionDetail?.aiLogs ?? null),
    [submissionDetail?.aiLogs],
  )
  const studentAnswerList = useMemo(() => {
    if (!submissionDetail?.studentAnswers) return []
    if (submissionDetail.studentAnswers.length === 0) return []
    return submissionDetail.studentAnswers.sort((a, b) => a.questionNumber - b.questionNumber)
  }, [submissionDetail])

  // Ưu tiên breakdown từ aiLogs (đầy đủ hơn), fallback về criteriaScores phẳng nếu parse lỗi
  const criteriaScores = parsedAiLog?.criteria_scores ?? submissionDetail?.criteriaScores ?? []
  const missingItems = parsedAiLog?.missing_items ?? []
  const overallComment = parsedAiLog?.overall_comment

  if (!submission) return null

  const handleFinalize = async () => {
    if (!submissionDetail) return
    const isSuccess = await finalizeScore(submissionDetail?.submissionId)
    if (isSuccess) {
      onSaved()
      onClose()
    }
  }

  const handleAppendItemManualGrade = (question_id: string, comment: string, actual_score: number) => {
    if (submissionDetail?.itemDetails && submissionDetail.itemDetails.length > 0) return
    const isQuestionAddedExisted = questionFixField.find((q) => q.questionId === question_id)
    if (!isQuestionAddedExisted) appendQuestionFix({ questionId: question_id, comment: comment, score: actual_score, notRecognized: '' })
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
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-default">
        {/* ===== Bên trái: bài làm sinh viên ===== */}
          <div className="flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between gap-2 border-b border-border-default px-5 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <FiTerminal className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-primary">Bài làm sinh viên</h3>
              </div>
              <span className="text-xs text-text-muted">
                {submissionDetail.studentName} · {submissionDetail.studentCode}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {studentAnswerList?.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-text-muted">Bài làm từng câu</p>
                  <ul className="space-y-2">
                    {studentAnswerList.map((answer, i) => (
                      <li key={i} className="rounded-md bg-bg-muted/50 px-3 py-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-text-primary">Question {answer.questionNumber}:</span>
                        </div>
                        {answer.extractedText ? (
                          <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                            {answer.extractedText}
                          </p>
                        )
                        :
                        <p className="mt-1 text-xs text-text-secondary leading-relaxed">Không có câu trả lời</p>
                      }
                        {answer.extractedImageUrl && 
                          <div className='my-2'>
                            <img src={answer.extractedImageUrl} alt="answer image" className='w-30 aspect-square'/>
                          </div>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ===== Ở giữa: kết quả AI chi tiết ===== */}
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
                      <li key={i} className="rounded-md bg-bg-muted/50 px-3 py-2" onClick={() => handleAppendItemManualGrade(c.question_id, c.comment, c.actual_score)}>
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

          {/* ===== Bên phải: chấm lại + comment khi giáo viên đã chấm lại ===== */}
        { submissionDetail.itemDetails.length > 0 && 
          <LecturerGradingSection
            submissionItemDetail={submissionDetail.itemDetails}
            submissionId= {submissionDetail.submissionId}
            onRefresh={refreshSubmissionDetail}
            lecturerComment={submissionDetail.comment}
          />
        }
        {/* ===== Bên phải: chấm lại + comment khi giáo viên chưa chấm lại===== */}
        { submissionDetail.itemDetails.length === 0 && 
          <div className='flex flex-col max-h-[70vh] overflow-y-auto'>
            <div className="flex items-center gap-2 border-b border-border-default px-5 py-3 shrink-0">
                <FiEdit3 className="w-4 h-4 text-text-muted" />
                <h3 className="text-sm font-semibold text-text-primary">Chấm lại & nhận xét</h3>
            </div>
                { questionFixField.map((qFix, index) => (
                  <div className="flex-1  px-5 py-4 space-y-4" key={qFix.questionId}>
                    <div className='flex items-center justify-between'>
                      <h2>{criteriaScores.find((q) => q.question_id === qFix.questionId)?.criterion}</h2>
                      <Button onClick={() => removeQuestionFix(index)} variant='danger'>
                        <FiTrash/>
                      </Button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Điểm chấm lại
                      </label>
                      <Input
                        {...register(`itemDetails.${index}.score`, { valueAsNumber: true })}
                        size="basic"
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Nhận xét
                      </label>
                      <textarea
                        {...register(`itemDetails.${index}.comment`)}
                        rows={5}
                        placeholder="Nhận xét về bài làm..."
                        className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none"
                      />
                    </div>
                  </div>
                  )) }
              {questionFixField.length > 0 &&
                <div className="flex flex-col  justify-end gap-2 border-t border-border-default px-5 py-3 shrink-0">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Điểm tổng cuối cùng
                    </label>
                    <Input
                      size='basic'
                      {...register('lecturerScore', { valueAsNumber: true })}
                      placeholder='5'
                      type='number'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Nhận xét chung
                    </label>
                      <textarea
                        {...register('comment')}
                        rows={5}
                        placeholder="Nhận xét về bài làm..."
                        className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none"
                      />
                  </div>
                  <Button variant="basic" onClick={onClose} type="button">
                    Hủy
                  </Button>
                  { submissionDetail.status != '3' &&
                    <Button onClick={handleSubmit(onSubmit)} disabled={saving} type="button">
                      {saving ? 'Đang lưu...' : 'Lưu điểm'}
                    </Button>
                  }
                </div>
              }
            </div>
        }

          </div>
      )}
      <div className='flex items-center justify-end w-full px-5 py-3'>
              <Button variant='danger' onClick={handleFinalize} disabled={loadingFinalize} type="button" className='w-fit'>
                  {loadingFinalize ? 'Đang lưu...' : 'Chấp nhận kết quả'}
              </Button>
      </div>
    </Modal>
  )
}