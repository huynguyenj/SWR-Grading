import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const examinationSchema = z.object({
  name: z.string().min(1, 'Tên bài thi không được để trống'),

  startDate: z.string().min(1, 'Ngày bắt đầu không được để trống'),

  startTime: z.string().min(1, 'Thời gian bắt đầu không được để trống'),

  durationMinutes: z.coerce.number().min(1, 'Thời lượng bài thi phải lớn hơn 0'),

  beforeTimeMinutes: z.coerce.number().min(0, 'Thời gian trước giờ thi không được nhỏ hơn 0'),

  note: z.string().optional(),

  semesterId: z.string().min(1, 'Vui lòng chọn học kỳ'),

  paperSetId: z.string().min(1, 'Vui lòng chọn bộ đề'),

  examinationType: z.string(),

  status: z.string(),
})

export type UpdateExaminationInput = z.input<typeof examinationSchema>
export type UpdateExaminationType = z.output<typeof examinationSchema>

export default function useUpdateExamination({ onRefresh, updateSelectedExaminationId }: { onRefresh: () => void, updateSelectedExaminationId?: string }) {
  const { execute, loading } = useApiCall()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateExaminationInput, unknown, UpdateExaminationType>({
    resolver: zodResolver(examinationSchema),
    defaultValues: {
      name: '',
      startDate: '',
      startTime: '',
      durationMinutes: 90,
      beforeTimeMinutes: 15,
      note: '',
      semesterId: '',
      paperSetId: '',
    },
  })

  const onSubmit = async (updateExaminationForm: UpdateExaminationType): Promise<boolean> => {
    if (!updateSelectedExaminationId) return false
    const body = {
      name: updateExaminationForm.name,
      examinationType: Number(updateExaminationForm.examinationType),
      startDate: updateExaminationForm.startDate,
      startTime: updateExaminationForm.startTime,
      durationMinutes: updateExaminationForm.durationMinutes,
      beforeTimeMinutes: updateExaminationForm.beforeTimeMinutes,
      note: updateExaminationForm.note ?? '',
      status: Number(updateExaminationForm.status),
      semesterId: updateExaminationForm.semesterId,
      paperSetId: updateExaminationForm.paperSetId,
    }

    const data = await execute({
      apiUrl: `/examinations/${updateSelectedExaminationId}`,
      method: 'put',
      type: 'private',
      body,
    })

    if (data.error) {
      toast.error(data.error.message)
      return false
    }

    onRefresh()
    toast.success('Tạo bài thi thành công')
    return true
  }

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    errors,
    loading,
    onSubmit,
  }
}