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
})

export type CreateExaminationInput = z.input<typeof examinationSchema>
export type CreateExaminationType = z.output<typeof examinationSchema>

export default function useCreateExamination({ onRefresh }: { onRefresh: () => void }) {
  const { execute, loading } = useApiCall()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateExaminationInput, unknown, CreateExaminationType>({
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

  const onSubmit = async (createExaminationForm: CreateExaminationType): Promise<boolean> => {
    const body = {
      name: createExaminationForm.name,
      examinationType: 0,
      startDate: createExaminationForm.startDate,
      startTime: createExaminationForm.startTime,
      durationMinutes: createExaminationForm.durationMinutes,
      beforeTimeMinutes: createExaminationForm.beforeTimeMinutes,
      note: createExaminationForm.note ?? '',
      status: 0,
      semesterId: createExaminationForm.semesterId,
      paperSetId: createExaminationForm.paperSetId,
    }

    const data = await execute({
      apiUrl: '/examinations',
      method: 'post',
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