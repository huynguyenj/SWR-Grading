import {
  FiAward,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiLayers,
} from 'react-icons/fi'

import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'

import type { StudentSubmission } from '../types/student_submission'
import { getSubmissionFileName } from '../utils/file_extracted'

interface ViewGradingHistoryModalProps {
  submission: StudentSubmission | null
  onClose: () => void
}

export default function ViewGradingHistoryModal({
  submission,
  onClose,
}: ViewGradingHistoryModalProps) {
  const histories = submission?.gradingHistories ?? []

  return (
    <Modal
      open={submission !== null}
      onClose={onClose}
      title="Lịch sử chấm bài"
      maxWidth="xl"
    >
      {submission && (
        <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-4">
          {/* ===== Submission information ===== */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Thông tin bài nộp
            </h3>

            <div className="rounded-lg border border-border-default bg-bg-surface p-4 space-y-3">
              <div>
                <p className="text-xs text-text-muted">
                  Sinh viên
                </p>

                <p className="mt-1 font-medium text-text-primary">
                  {submission.studentName}
                </p>

                <p className="text-sm text-text-secondary">
                  {submission.studentCode}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-text-muted">
                    Kỳ thi
                  </p>

                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {submission.examination?.name || '—'}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {submission.examinationCode || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted">
                    Học kỳ
                  </p>

                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {submission.semester?.semesterCode || '—'}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {submission.semester?.name || '—'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Tên file bài nộp
                </p>

                <p className="mt-1 break-all text-sm text-text-secondary">
                  {getSubmissionFileName(submission.submissionFile) || '—'}
                </p>
              </div>
            </div>
          </section>

          {/* ===== Grading histories ===== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                Các lần chấm
              </h3>

              <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-semibold text-brand-orange">
                {histories.length} lần chấm
              </span>
            </div>

            {histories.length > 0 ? (
              <div className="space-y-4">
                {histories.map((history, index) => (
                  <div
                    key={history.historyId}
                    className="rounded-lg border border-border-default bg-bg-primary p-4 space-y-4"
                  >
                    {/* History header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-bg-muted px-2 py-1 text-xs font-semibold text-text-secondary">
                            Lần chấm {index + 1}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              history.statusName === 'OFFICIAL'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-brand-orange/10 text-brand-orange'
                            }`}
                          >
                            {history.statusName || '—'}
                          </span>
                        </div>

                        <h4 className="mt-2 font-semibold text-text-primary">
                          {history.evaluationTypeName || 'Đánh giá'}
                        </h4>
                      </div>

                      <div className="shrink-0 rounded-lg bg-brand-orange/10 px-4 py-3 text-center">
                        <p className="text-xs text-text-secondary">
                          Tổng điểm
                        </p>

                        <p className="mt-1 text-2xl font-bold text-brand-orange">
                          {history.totalScore}
                        </p>
                      </div>
                    </div>

                    {/* History metadata */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <FiLayers className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                        <div>
                          <p className="text-xs text-text-muted">
                            Vòng chấm
                          </p>

                          <p className="text-sm font-medium text-text-primary">
                            Vòng {history.gradingRound}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <FiCalendar className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                        <div>
                          <p className="text-xs text-text-muted">
                            Thời gian chấm
                          </p>

                          <p className="text-sm font-medium text-text-primary">
                            {formatDate(history.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* General feedback */}
                    <div className="rounded-lg bg-bg-muted/50 p-3">
                      <div className="flex items-start gap-2">
                        <FiMessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-text-secondary">
                            Nhận xét tổng quát
                          </p>

                          <p className="mt-1 whitespace-pre-line text-sm text-text-secondary">
                            {history.generalFeedback ||
                              'Không có nhận xét tổng quát.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Question details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-text-primary">
                          Chi tiết điểm
                        </h5>

                        <span className="text-xs text-text-muted">
                          {history.details?.length ?? 0} mục
                        </span>
                      </div>

                      {history.details?.length > 0 ? (
                        <div className="space-y-2">
                          {history.details.map((detail, detailIndex) => (
                            <div
                              key={detail.detailId}
                              className="rounded-lg border border-border-default p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-2">
                                  <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-text-primary">
                                      Mục {detailIndex + 1}
                                    </p>

                                    <p
                                      className="mt-1 truncate text-xs text-text-muted"
                                      title={detail.parsedAnswerId}
                                    >
                                      Phần trả lời: {detail.parsedAnswerId}
                                    </p>
                                  </div>
                                </div>

                                <span className="shrink-0 rounded-md bg-brand-orange/10 px-2.5 py-1 text-sm font-semibold text-brand-orange">
                                  {detail.score} điểm
                                </span>
                              </div>

                              <div className="mt-3 border-t border-border-default pt-3">
                                <p className="text-xs font-medium text-text-secondary">
                                  Nhận xét
                                </p>

                                <p className="mt-1 whitespace-pre-line text-sm text-text-secondary">
                                  {detail.comment || 'Không có nhận xét.'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-border-strong py-8 text-center">
                          <FiFileText className="mx-auto h-7 w-7 text-text-muted" />

                          <p className="mt-2 text-sm text-text-secondary">
                            Không có chi tiết điểm.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border-strong py-10 text-center">
                <FiAward className="mx-auto h-8 w-8 text-text-muted" />

                <p className="mt-2 font-medium text-text-secondary">
                  Chưa có lịch sử chấm
                </p>

                <p className="mt-1 text-sm text-text-muted">
                  Bài nộp này chưa có kết quả chấm nào.
                </p>
              </div>
            )}
          </section>

          {/* ===== Footer ===== */}
          <div className="flex justify-end border-t border-border-default pt-4">
            <Button variant="basic" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}