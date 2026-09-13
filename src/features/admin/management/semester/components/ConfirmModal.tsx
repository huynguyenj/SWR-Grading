import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import useDeleteSemester from '../hooks/useDeleteSemester'
import type { SemesterType } from '../types/semester'

interface ConfirmDeleteSemesterModalProps {
  open: boolean
  onClose: () => void
  onRefresh: () => void
  semester?: SemesterType
}

export default function ConfirmDeleteSemesterModal({
  open,
  onClose,
  onRefresh,
  semester
}: ConfirmDeleteSemesterModalProps) {
  const { onDelete, loading } = useDeleteSemester({ onRefresh: onRefresh, selectedSemesterId: semester?.semesterId })
  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Xác nhận">
      <div className="px-5 py-4 space-y-4">
        <p className='text-m'>Bạn có chắc muốn xóa {semester?.name} không ?</p>
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
            className='disabled:bg-bg-muted text-text-primary'
          >
            {loading ? 'Đang xóa...' : 'Đồng ý'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}