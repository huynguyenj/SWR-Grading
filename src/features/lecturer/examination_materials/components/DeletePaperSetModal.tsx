import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'

interface DeletePaperSetModalProps {
  open: boolean
  onDelete: () => void
  onClose: () => void
  loading: boolean
}

export default function DeletePaperSetModal({
  open,
  onClose,
  onDelete,
  loading
}: DeletePaperSetModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Xác nhận">
      <div className="px-5 py-4 space-y-4">
        <p className='text-m'>Bạn có chắc muốn xóa không ?</p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant='basic'
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant='danger'
            onClick={onDelete}
            className='disabled:bg-bg-muted'
          >
            {loading ? 'Đang xóa...' : 'Đồng ý'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}