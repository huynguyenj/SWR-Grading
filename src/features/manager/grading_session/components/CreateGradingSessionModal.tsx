
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

import useCreateGradingSession, {
  type CreateGradingSessionType,
} from '../hooks/useCreateGradingSession'

interface CreateGradingSessionModalProps {
  examinationSessionId: string
  onClose: () => void
  isOpen: boolean
  refresh: () => void
}

export default function CreateGradingSessionModal({
  examinationSessionId,
  onClose,
  isOpen,
  refresh,
}: CreateGradingSessionModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    reset,
  } = useCreateGradingSession({
    examinationSessionId,
    onRefresh: refresh,
  })

  // Reset form khi đóng modal.
  const handleClose = () => {
    if (loading) return

    reset()
    onClose()
  }

  // Submit form.
  const handleCreate = async (
    values: CreateGradingSessionType,
  ) => {
    const success = await onSubmit(values)

    if (success) {
      reset()
      onClose()
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Tạo phiên chấm"
      maxWidth="xl"
    >
      <form
        onSubmit={handleSubmit(handleCreate)}
        className="space-y-5 px-5 py-5"
      >
        {/* Grading session information */}
        <div className="rounded-lg border border-border-default bg-bg-muted/40 p-3">
          <p className="text-xs text-text-muted">
            Đợt thi
          </p>

          <p className="mt-1 font-medium text-text-primary">
            Tạo phiên chấm cho đợt thi đã chọn
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            Vui lòng nhập thông tin phiên chấm bên dưới.
          </p>
        </div>

        {/* Grading session title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Tên phiên chấm <span className="text-danger">*</span>
          </label>

          <Input
            type="text"
            size="basic"
            {...register('title')}
            placeholder="Nhập tên phiên chấm"
            disabled={loading}
            error={errors.title?.message}
          />
        </div>

        {/* Grading session type */}
        <div>
          <label
            htmlFor="gradingSessionType"
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            Loại phiên chấm <span className="text-danger">*</span>
          </label>

          <select
            id="gradingSessionType"
            {...register('type', {
              valueAsNumber: true,
            })}
            disabled={loading}
            className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value={0}>Chấm bình thường</option>
            <option value={1}>Chấm lại</option>
          </select>

          {errors.type && (
            <p className="mt-1 text-xs text-danger">
              {errors.type.message}
            </p>
          )}

          <p className="mt-1 text-xs text-text-muted">
            Chọn loại phiên chấm tương ứng với mục đích đánh giá bài thi.
          </p>
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Hạn chót <span className="text-danger">*</span>
          </label>

          <Input
            type="date"
            size="basic"
            {...register('deadline')}
            disabled={loading}
            error={errors.deadline?.message}
          />

          <p className="mt-1 text-xs text-text-muted">
            Ngày cuối cùng để hoàn thành việc chấm bài.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-border-default pt-4">
          <Button
            type="button"
            variant="basic"
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo phiên chấm'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
