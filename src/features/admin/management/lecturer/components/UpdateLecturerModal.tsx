
import { useEffect } from 'react'

import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'

import useUpdateLecturer, {
  type UpdateLecturerType,
} from '../hooks/useUpdateLecturer'

import type { LecturerType } from '../types/lecturer.type'

interface UpdateLecturerModalProps {
  lecturer: LecturerType | null
  onClose: () => void
  onRefresh: () => void
}

export default function UpdateLecturerModal({
  lecturer,
  onClose,
  onRefresh,
}: UpdateLecturerModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    reset,
  } = useUpdateLecturer({
    onRefresh,
    updateSelectedLecturerId: lecturer?.id,
  })

  // Đổ dữ liệu giảng viên vào form khi mở modal.
  useEffect(() => {
    if (!lecturer) {
      reset()
      return
    }

    reset({
      fullName: lecturer.fullName,
      email: lecturer.email,
      subject: lecturer.subject,
    })
  }, [lecturer, reset])

  async function handleFormSubmit(data: UpdateLecturerType) {
    const success = await onSubmit(data)
    if (success) {
      reset()
      onClose()
    }
  }
  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Modal
      open={lecturer !== null}
      onClose={handleClose}
      title="Cập nhật giảng viên"
      maxWidth="md"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5 px-5 py-4"
      >
        {/* Thông tin giảng viên */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Thông tin giảng viên
          </h3>

          {/* Mã giảng viên */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Mã giảng viên
            </label>

            <Input
              size="basic"
              value={lecturer?.lecturerCode ?? ''}
              disabled
            />
          </div>

          {/* Họ và tên */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Họ và tên
            </label>

            <Input
              size="basic"
              placeholder="Nhập họ và tên"
              {...register('fullName')}
            />

            {errors.fullName && (
              <p className="mt-1 text-xs text-danger">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Email
            </label>

            <Input
              size="basic"
              type="email"
              placeholder="Nhập email"
              {...register('email')}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-danger">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Chuyên ngành */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Chuyên ngành
            </label>

            <Input
              size="basic"
              placeholder="Nhập chuyên ngành"
              {...register('subject')}
            />

            {errors.subject && (
              <p className="mt-1 text-xs text-danger">
                {errors.subject.message}
              </p>
            )}
          </div>
        </section>

        {/* Thống kê chỉ đọc */}
        {lecturer && (
          <section className="grid grid-cols-2 gap-3 rounded-md bg-bg-muted/50 p-3">
            <div>
              <p className="text-xs text-text-muted">
                Số bộ đề
              </p>

              <p className="mt-1 text-sm font-semibold text-text-primary">
                {lecturer.paperSetsCount}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-muted">
                Số grading diary
              </p>

              <p className="mt-1 text-sm font-semibold text-text-primary">
                {lecturer.gradingDiariesCount}
              </p>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-border-default pt-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="basic"
            disabled={loading}
          >
            Hủy
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật giảng viên'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
