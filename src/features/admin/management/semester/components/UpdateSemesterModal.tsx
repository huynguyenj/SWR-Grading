import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import useUpdateSemester from '../hooks/useUpdateSemester'
import type { SemesterStatus, SemesterType } from '../types/semester'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'

interface UpdateSemesterModalProps {
  open: boolean
  onClose: () => void
  onRefresh: () => void
  semester?: SemesterType
}

const statusOptions: { value: SemesterStatus | 'all'; label: string }[] = [
  { value: 0, label: 'Sắp diễn ra' },
  { value: 1, label: 'Đang hoạt động' },
  { value: 2, label: 'Đã kết thúc' },
]


export default function UpdateSemesterModal({
  open,
  onClose,
  onRefresh,
  semester
}: UpdateSemesterModalProps) {
  const { handleSubmit, onSubmit, updateRegister, errors, reset, control, setSelectedSemesterId, loading } = useUpdateSemester({ onRefresh: onRefresh })

  useEffect(() => {
    if (!open) return

    if (semester) {
      reset({
        name: semester.name,
        semesterCode: semester.semesterCode,
        startDate: semester.startDate,
        endDate: semester.endDate
      })
      setSelectedSemesterId(semester.semesterId)
    }
  }, [open, semester])

  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title="Tạo học kỳ mới">
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Tên học kỳ
          </label>
          <Input
            {...updateRegister('name')}
            size='basic'
            placeholder="VD: Học kỳ Fall 2026"
            error={errors.name?.message}
          />
        </div>
 
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Mã học kỳ
          </label>
          <Input
            {...updateRegister('semesterCode')}
            size='basic'
            placeholder="VD: FA26"
            error={errors?.semesterCode?.message}
          />
        </div>
 
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Ngày bắt đầu
            </label>
            <input
              {...updateRegister('startDate')}
              type="date"
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Ngày kết thúc
            </label>
            <input
              {...updateRegister('endDate')}
              type="date"
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            />
          </div>
        </div>
            {/* Status filter */}
        <label className="block text-sm font-medium text-text-primary mb-1.5">
              Trạng thái
        </label>
        <Controller
            control={control}
            name='status'
            render={({ field }) => (
            <select
                  onChange={field.onChange}
                  className="rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
            >
                  {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                              {opt.label}
                        </option>
            ))}
            </select>
            )}
        />
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
            className='disabled:bg-bg-muted text-text-primary'
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}