import {
  FiUser,
  FiFileText,
  FiAward,
  FiCalendar,
  FiMessageSquare,
} from 'react-icons/fi'

import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'
import type { OfficialSubmission } from '../types/official_submission'

interface ViewOfficialSubmissionModalProps {
  submission: OfficialSubmission | null
  onClose: () => void
}

export default function ViewOfficialSubmissionModal({
  submission,
  onClose,
}: ViewOfficialSubmissionModalProps) {
  const details = submission?.details ?? []

  return (
    <Modal
      open={submission !== null}
      onClose={onClose}
      title="Chi tiết bài thi chính thức"
      maxWidth="xl"
    >
      {submission && (
        <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-4">
          {/* ===== Thông tin sinh viên ===== */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Thông tin sinh viên
            </h3>

            <div className="rounded-lg border border-border-default bg-bg-surface p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <FiUser className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-text-primary">
                    {submission.studentName}
                  </p>

                  <p className="text-sm text-text-secondary">
                    {submission.studentCode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-text-muted">
                    Mã sinh viên
                  </p>

                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {submission.studentCode}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted">
                    Tên sinh viên
                  </p>

                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {submission.studentName}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== Thông tin đợt thi ===== */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Thông tin đợt thi
            </h3>

            <div className="grid grid-cols-1 gap-3 rounded-lg bg-bg-muted/50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-text-muted">
                  Tên kỳ thi
                </p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {submission.examinationName || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Mã đợt thi
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {submission.examinationCode || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Bộ đề thi
                </p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {submission.paperSetCode || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Học kỳ
                </p>

                <p className="mt-1 text-sm font-medium text-text-primary">
                  {submission.semesterName} ({submission.semesterCode})
                </p>
              </div>
            </div>
          </section>

          {/* ===== Điểm chính thức ===== */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Kết quả chấm chính thức
            </h3>

            <div className="rounded-lg border border-border-default bg-bg-primary p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                    <FiAward className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">
                      Điểm chính thức
                    </p>

                    <p className="text-3xl font-bold text-brand-orange">
                      {submission.officialScore}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-text-muted">
                      Người chấm
                    </p>

                    <p className="font-medium text-text-primary">
                      {submission.gradedBy || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-muted">
                      Thời gian chấm
                    </p>

                    <p className="flex items-center gap-2 text-text-secondary">
                      <FiCalendar className="h-3.5 w-3.5" />
                      {formatDate(submission.gradedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== Chi tiết điểm từng câu ===== */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                Chi tiết điểm từng câu
              </h3>

              <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-semibold text-brand-orange">
                {details.length} câu hỏi
              </span>
            </div>

            {details.length > 0 ? (
              <div className="space-y-3">
                {details.map((detail, index) => {
                  const percentage =
                    detail.maxScore > 0
                      ? (detail.score / detail.maxScore) * 100
                      : 0

                  return (
                    <div
                      key={detail.detailId}
                      className="rounded-lg border border-border-default bg-bg-primary p-4 space-y-4"
                    >
                      {/* Question title */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-text-muted">
                            Câu {index + 1}
                          </p>

                          <h4 className="mt-1 font-medium text-text-primary">
                            {detail.questionTitle}
                          </h4>
                        </div>

                        <div className="shrink-0 rounded-lg bg-bg-muted/50 px-3 py-2 text-center">
                          <p className="text-xs text-text-muted">
                            Điểm đạt
                          </p>

                          <p className="font-semibold text-brand-orange">
                            {detail.score} / {detail.maxScore}
                          </p>
                        </div>
                      </div>

                      {/* Score progress */}
                      <div className="space-y-2">
                        <div className="h-2 overflow-hidden rounded-full bg-bg-muted">
                          <div
                            className="h-full rounded-full bg-brand-orange transition-all"
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-xs text-text-muted">
                          <span>
                            Đạt {percentage.toFixed(1)}%
                          </span>

                          <span>
                            Tối đa {detail.maxScore} điểm
                          </span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="border-t border-border-default pt-3">
                        <div className="flex items-start gap-2">
                          <FiMessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-text-secondary">
                              Nhận xét
                            </p>

                            <p className="mt-1 whitespace-pre-line text-sm text-text-secondary">
                              {detail.comment || 'Không có nhận xét.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border-strong py-10 text-center">
                <FiFileText className="mx-auto h-8 w-8 text-text-muted" />

                <p className="mt-2 text-sm font-medium text-text-secondary">
                  Không có chi tiết chấm điểm
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