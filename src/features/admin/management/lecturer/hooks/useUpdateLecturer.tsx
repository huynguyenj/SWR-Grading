
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const lecturerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Họ và tên không được để trống'),

  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),

  subject: z
    .string()
    .trim()
    .min(1, 'Chuyên ngành không được để trống'),
})

export type UpdateLecturerInput = z.input<typeof lecturerSchema>
export type UpdateLecturerType = z.output<typeof lecturerSchema>

interface UseUpdateLecturerProps {
  onRefresh: () => void
  updateSelectedLecturerId?: string
}

export default function useUpdateLecturer({
  onRefresh,
  updateSelectedLecturerId,
}: UseUpdateLecturerProps) {
  const { execute, loading } = useApiCall()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateLecturerInput, unknown, UpdateLecturerType>({
    resolver: zodResolver(lecturerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
    },
  })

  const onSubmit = async (
    updateLecturerForm: UpdateLecturerType,
  ): Promise<boolean> => {
    if (!updateSelectedLecturerId) {
      toast.error('Không tìm thấy giảng viên cần cập nhật')
      return false
    }

    const body = {
      fullName: updateLecturerForm.fullName,
      email: updateLecturerForm.email,
      subject: updateLecturerForm.subject,
    }

    try {
      await execute({
        apiUrl: `/admin/lecturers/${updateSelectedLecturerId}`,
        method: 'put',
        type: 'private',
        body,
      })

      onRefresh()
      toast.success('Cập nhật thông tin giảng viên thành công')

      return true
    } catch {
      return false
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    reset,
  }
}
