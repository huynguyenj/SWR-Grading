import { FiCalendar, FiFileText } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'
import ExamSessionStatusBadge from './ExaminationBadge'
import {
  EXAMINATION_KIND_LABEL,
  type ExaminationType,
} from '../types/examination.type'
import useGetExaminationDetail from '../hooks/useGetExaminationDetail'
import ExaminationPaperSetCard from '@/features/examiner/management/examination/components/ExaminationPaperSetCard'

interface ViewExamSessionModalProps {
  session: ExaminationType | null
  onClose: () => void
}

export default function ViewExamSessionModal({
  session,
  onClose,
}: ViewExamSessionModalProps) {
  const { examinationDetail, loading } = useGetExaminationDetail({
    examinationId: session?.examinationId ?? '',
  })

  const detail = examinationDetail

  return (
    <Modal
      open={session !== null}
      onClose={onClose}
      title={detail?.name ?? session?.name ?? 'Chi tiết đợt thi'}
      maxWidth="xl"
    >
      {session && (
        <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-4">
          {/* Loading */}
          {loading && !detail && (
            <div className="py-12 text-center">
              <p className="text-sm text-text-muted">
                Đang tải thông tin đợt thi...
              </p>
            </div>
          )}

          {/* Nội dung chi tiết */}
          {detail && (
            <>
              {/* ===== Thông tin chung ===== */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  Thông tin chung
                </h3>

                <div className="rounded-lg border border-border-default bg-bg-surface p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ExamSessionStatusBadge status={detail.status} />

                    <span className="text-sm text-text-secondary">
                      {EXAMINATION_KIND_LABEL[detail.examinationType] ?? '—'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-text-muted">Tên đợt thi</p>
                    <p className="mt-1 font-medium text-text-primary">
                      {detail.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-muted">Mã đợt thi</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {detail.examinationCode || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-text-muted">Mã học kỳ</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      {detail.semesterId}
                    </p>
                  </div>
                </div>
              </section>

              {/* ===== Thời gian tổ chức ===== */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  Thời gian tổ chức
                </h3>

                <div className="grid grid-cols-1 gap-3 rounded-lg bg-bg-muted/50 p-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 shrink-0 text-text-muted" />

                    <div>
                      <p className="text-xs text-text-muted">Ngày bắt đầu</p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatDate(detail.startDate)}
                      </p>
                    </div>
                  </div>

                  {detail.endDate && (
                    <div className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4 shrink-0 text-text-muted" />

                      <div>
                        <p className="text-xs text-text-muted">Ngày kết thúc</p>
                        <p className="text-sm font-medium text-text-primary">
                          {formatDate(detail.endDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4 shrink-0 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Giờ bắt đầu</p>
                      <p className="text-sm font-medium text-text-primary">
                        {detail.startTime}
                      </p>
                    </div>
                  </div> */}

                  {/* <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4 shrink-0 text-text-muted" />

                    <div>
                      <p className="text-xs text-text-muted">Thời lượng</p>
                      <p className="text-sm font-medium text-text-primary">
                        {detail.durationMinutes} phút
                      </p>
                    </div>
                  </div> */}

                  {/* <div className="sm:col-span-2">
                    <p className="text-xs text-text-muted">
                      Thời gian mở bài thi
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Bài thi được mở trước giờ bắt đầu{' '}
                      <span className="font-medium text-text-primary">
                        {detail.beforeTimeMinutes} phút
                      </span>
                    </p>
                  </div> */}
                </div>
              </section>

              {/* ===== Danh sách bộ đề thi ===== */}
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Danh sách bộ đề thi
                  </h3>

                  <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-semibold text-brand-orange">
                    {detail.paperSets?.length ?? 0} bộ đề
                  </span>
                </div>

                {detail.paperSets && detail.paperSets.length > 0 ? (
                  <div className="space-y-3">
                    {detail.paperSets.map((paperSet) =>
                      <ExaminationPaperSetCard paperSet={paperSet}/>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border-strong py-10 text-center">
                    <FiFileText className="mx-auto h-8 w-8 text-text-muted" />

                    <p className="mt-2 text-sm font-medium text-text-secondary">
                      Chưa có bộ đề thi
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Đợt thi này chưa được gán bộ đề nào.
                    </p>
                  </div>
                )}
              </section>

              {/* ===== Ghi chú ===== */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  Ghi chú
                </h3>

                {detail.note ? (
                  <p className="whitespace-pre-line rounded-lg bg-bg-muted/50 p-4 text-sm text-text-secondary">
                    {detail.note}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted">
                    Không có ghi chú.
                  </p>
                )}
              </section>
            </>
          )}

          {/* Lỗi hoặc không tải được dữ liệu */}
          {!loading && !detail && (
            <div className="py-10 text-center">
              <p className="text-sm text-danger">
                Không thể tải thông tin chi tiết đợt thi.
              </p>
            </div>
          )}

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