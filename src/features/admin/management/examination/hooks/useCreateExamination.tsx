import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const examinationSchema = z.object({
  name: z.string().min(1, 'Tên bài thi không được để trống'),

  startDate: z.string().min(1, 'Ngày bắt đầu không được để trống'),

  note: z.string().optional(),

  semesterId: z.string().min(1, 'Vui lòng chọn học kỳ'),

  paperSetIds: z.array(z.string()).default([]).nullable(),

  examinationType: z.number().default(0)
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
      note: '',
      semesterId: '',
    },
  })

  const onSubmit = async (createExaminationForm: CreateExaminationType): Promise<boolean> => {
    const body = {
      name: createExaminationForm.name,
      examinationType: Number(createExaminationForm.examinationType),
      startDate: createExaminationForm.startDate,
      note: createExaminationForm.note ?? '',
      status: 0,
      semesterId: createExaminationForm.semesterId,
      paperSetId: [],
    }
    console.log(body);
    
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
    toast.success('Tạo kì thi thành công')
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