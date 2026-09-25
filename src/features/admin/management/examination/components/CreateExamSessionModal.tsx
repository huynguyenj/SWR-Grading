import { useEffect } from 'react'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import type { SemesterType } from '../../semester/types/semester'
import useCreateExamination, { type CreateExaminationType } from '../hooks/useCreateExamination'
import useGetSemesterDetail from '../../semester/hooks/useGetDetailSemesterAdmin'

interface CreateExamSessionModalProps {
  open: boolean
  onClose: () => void
  onRefresh: () => void
  semesters: SemesterType[]
}

export default function CreateExamSessionModal({
  open,
  onClose,
  onRefresh,
  semesters,
}: CreateExamSessionModalProps) {
  const { register, handleSubmit, watch, setValue, reset, errors, loading, onSubmit } =
    useCreateExamination({ onRefresh })

  // Bộ đề phụ thuộc vào học kỳ đang chọn -> theo dõi giá trị semesterId trong form
  const semesterId = watch('semesterId')
  const { semesterDetail, loading: loadingPaperSets } = useGetSemesterDetail(semesterId)
  const paperSets = semesterDetail?.paperSets ?? []

  // Đổi học kỳ -> bộ đề đã chọn trước đó (nếu có) không còn hợp lệ, reset lại
  useEffect(() => {
    setValue('paperSetId', '')
  }, [semesterId, setValue])

  // Đóng modal thì reset sạch form, tránh giữ lại dữ liệu cũ cho lần mở sau
  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  async function handleFormSubmit(data: CreateExaminationType) {
    const success = await onSubmit(data)
    if (success) {
      reset()
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Tạo đợt thi mới" maxWidth="xl">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-h-[75vh] overflow-y-auto px-5 py-4 space-y-6"
      >
        {/* ===== Thông tin chung ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Thông tin chung</h3>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Tên đợt thi
            </label>
            <Input
              size="basic"
              placeholder="VD: Đợt thi thực hành giữa kỳ - Ca 1"
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Học kỳ</label>
            <select
              {...register('semesterId')}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            >
              <option value="">-- Chọn học kỳ --</option>
              {semesters.map((s) => (
                <option key={s.semesterId} value={s.semesterId}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.semesterId && (
              <p className="mt-1 text-xs text-danger">{errors.semesterId.message}</p>
            )}
          </div>
        </section>

        {/* ===== Đề thi ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Đề thi</h3>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Bộ đề</label>
            <select
              {...register('paperSetId')}
              disabled={!semesterId || loadingPaperSets}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!semesterId
                  ? '-- Chọn học kỳ trước --'
                  : loadingPaperSets
                    ? 'Đang tải bộ đề...'
                    : paperSets.length === 0
                      ? 'Học kỳ này chưa có bộ đề nào'
                      : '-- Chọn bộ đề --'}
              </option>
              {paperSets.map((p) => (
                <option key={p.paperSetId} value={p.paperSetId}>
                  {p.paperSetCode}
                </option>
              ))}
            </select>
            {errors.paperSetId && (
              <p className="mt-1 text-xs text-danger">{errors.paperSetId.message}</p>
            )}
          </div>
        </section>

        {/* ===== Thời gian tổ chức ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Thời gian tổ chức</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Ngày thi
              </label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-danger">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                {...register('startTime')}
                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
              />
              {errors.startTime && (
                <p className="mt-1 text-xs text-danger">{errors.startTime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Thời lượng làm bài (phút)
              </label>
              <Input type="number" min={1} size="basic" {...register('durationMinutes')} />
              {errors.durationMinutes && (
                <p className="mt-1 text-xs text-danger">{errors.durationMinutes.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Mở bài thi trước giờ thi (phút)
              </label>
              <Input type="number" min={0} size="basic" {...register('beforeTimeMinutes')} />
              {errors.beforeTimeMinutes && (
                <p className="mt-1 text-xs text-danger">{errors.beforeTimeMinutes.message}</p>
              )}
              <p className="mt-1 text-xs text-text-muted">
                Thí sinh sẽ vào được phòng thi trước giờ bắt đầu này để chuẩn bị.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Ghi chú ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Ghi chú</h3>
          <textarea
            {...register('note')}
            rows={3}
            placeholder="VD: Thí sinh cần có mặt trước 15 phút, mang theo thẻ sinh viên..."
            className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none"
          />
          {errors.note && <p className="mt-1 text-xs text-danger">{errors.note.message}</p>}
        </section>

        <div className="flex items-center justify-end gap-2 border-t border-border-default pt-4">
          <Button type="button" onClick={onClose} variant="basic">
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang tạo...' : 'Tạo đợt thi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}