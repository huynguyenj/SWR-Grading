import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import type { ExaminationType } from '../types/examination.type'
import useDeleteExamination from '../hooks/useDeleteExamination'

interface ConfirmDeleteExaminationModalProps {
  onClose: () => void
  onRefresh: () => void
  examination:  ExaminationType | null
}

export default function ConfirmDeleteExamModal({
  onClose,
  onRefresh,
  examination
}: ConfirmDeleteExaminationModalProps) {
  const { onDelete, loading } = useDeleteExamination({ onRefresh: onRefresh, selectedDeleteExaminationId: examination?.examinationId })
  if (!open) return null
  if (!examination) return null
  return (
    <Modal open={examination != null} onClose={onClose} title="Xác nhận">
      <div className="px-5 py-4 space-y-4">
        <p className='text-m'>Bạn có chắc xóa đợt thi {examination.name} không ?</p>
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