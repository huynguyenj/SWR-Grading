
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const lecturerSchema = z.object({
  fullName: z.string().trim().min(1, 'Họ và tên không được để trống'),
  email: z.string().trim().min(1, 'Email không được để trống').email('Email không hợp lệ'),
  subject: z.string().trim().min(1, 'Chuyên ngành không được để trống'),
})

type UpdateLecturerInput = z.input<typeof lecturerSchema>
type UpdateLecturerType = z.output<typeof lecturerSchema>

type UseUpdateLecturerProps = {
  onRefresh: () => void
}

export default function useUpdateLecturer({
  onRefresh,
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

  const [selectedLecturerId, setSelectedLecturerId] = useState('')

  const onSubmit = async (updateLecturerForm: UpdateLecturerType) => {
    if (!selectedLecturerId) {
      toast.error('Không tìm thấy giảng viên cần cập nhật')
      return
    }

    const body = {
      fullName: updateLecturerForm.fullName,
      email: updateLecturerForm.email,
      subject: updateLecturerForm.subject,
    }

    const response = await execute({
      apiUrl: `/admin/lecturers/${selectedLecturerId}`,
      method: 'put',
      type: 'private',
      body,
    })
    
    if (response.error) {
      toast.error(response.error.message)
      return
    }

    onRefresh()
    toast.success('Cập nhật thông tin giảng viên thành công')
  }

  return {
    updateRegister: register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    reset,
    setSelectedLecturerId,
  }
}
