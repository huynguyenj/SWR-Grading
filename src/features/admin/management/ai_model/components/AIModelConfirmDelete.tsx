
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi'

import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'

interface AIModelConfirmDeleteProps {
  open: boolean
  modelName: string
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function AIModelConfirmDelete({
  open,
  modelName,
  loading,
  onClose,
  onConfirm,
}: AIModelConfirmDeleteProps) {
  const handleClose = () => {
    if (loading) return
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Xác nhận xóa AI model"
      maxWidth="xl"
    >
      <div className="space-y-5 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
            <FiAlertTriangle size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-text-primary">
              Bạn có chắc chắn muốn xóa?
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              AI model{' '}
              <span className="font-semibold text-text-primary">
                {modelName}
              </span>{' '}
              sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

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
            type="button"
            variant="default"
            onClick={onConfirm}
            disabled={loading}
          >
            <FiTrash2 size={15} />
            <span className="ml-1">
              {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
