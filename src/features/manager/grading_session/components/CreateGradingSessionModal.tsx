import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import useCreateGradingSession, { type CreateGradingSessionType } from '../hooks/useCreateGradingSession'
import Input from '@/components/ui/input'

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
  refresh
}: CreateGradingSessionModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
  } = useCreateGradingSession({
    examinationSessionId,
    onRefresh: refresh,
  })

  const handleCreate = async (values: CreateGradingSessionType) => {
    const success = await onSubmit(values)

    if (success) {
      onClose()
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
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
            size='basic'
            {...register('title')}
            placeholder="Nhập tên phiên chấm"
            disabled={loading}
            error={errors.title?.message}
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Hạn chót <span className="text-danger">*</span>
          </label>

          <Input
            type="date"
            size='basic'
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
            onClick={onClose}
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