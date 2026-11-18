
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const gradingSessionSchema = z.object({
  title: z.string().trim().min(1, 'Tên phiên chấm không được để trống'),

  type: z
    .number()
    .int()
    .refine((value) => value === 0 || value === 1, {
      message: 'Loại phiên chấm không hợp lệ',
    }),

  deadline: z.coerce.date({
    error: 'Vui lòng chọn hạn chót',
  }),
})

type CreateGradingSessionInput = z.input<typeof gradingSessionSchema>

export type CreateGradingSessionType = z.output<
  typeof gradingSessionSchema
>

interface UseCreateGradingSessionProps {
  examinationSessionId: string
  onRefresh: () => void
}

export default function useCreateGradingSession({
  examinationSessionId,
  onRefresh,
}: UseCreateGradingSessionProps) {
  const { execute, loading } = useApiCall()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<
    CreateGradingSessionInput,
    unknown,
    CreateGradingSessionType
  >({
    resolver: zodResolver(gradingSessionSchema),
    defaultValues: {
      title: '',
      type: 0,
      deadline: undefined,
    },
  })

  const onSubmit = async (
    createGradingSessionForm: CreateGradingSessionType,
  ): Promise<boolean> => {
    const body = {
      title: createGradingSessionForm.title,
      type: createGradingSessionForm.type,
      deadline: createGradingSessionForm.deadline
        .toISOString()
        .split('T')[0],
    }

    const response = await execute({
      apiUrl: `/sessions/${examinationSessionId}/grading-sessions`,
      method: 'post',
      type: 'private',
      body,
    })

    if (response.error) {
      toast.error(response.error.message)
      return false
    }

    reset()
    onRefresh()

    toast.success('Tạo phiên chấm thành công')
    return true
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
