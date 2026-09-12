import type { Semester } from '../types/semester'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import useCreateSemester from '../hooks/useCreateSemester'

interface CreateSemesterModalProps {
  open: boolean
  onClose: () => void
  onCreate: (semester: Semester) => void
}

export default function CreateSemesterModal({
  open,
  onClose,
}: CreateSemesterModalProps) {
  const { handleSubmit, onSubmit, register } = useCreateSemester()
  if (!open) return null


  return (
    <Modal open={open} onClose={onClose} title="Tạo học kỳ mới">
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Tên học kỳ
          </label>
          <Input
            {...register('name')}
            size='basic'
            placeholder="VD: Học kỳ Fall 2026"
            
          />
        </div>
 
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Mã học kỳ
          </label>
          <Input
            {...register('semesterCode')}
            size='basic'
            placeholder="VD: FA26"
          />
        </div>
 
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Ngày bắt đầu
            </label>
            <input
              {...register('startDate')}
              type="date"
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Ngày kết thúc
            </label>
            <input
              {...register('endDate')}
              type="date"
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            />
          </div>
        </div>
 
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
            variant='default'
          >
            Tạo học kỳ
          </Button>
        </div>
      </form>
    </Modal>
  )
}