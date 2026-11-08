import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

export const singleAssignGradingSchema = z.object({
    staffId: z.string().uuid('ID giảng viên không hợp lệ'),
    numberSubmissions: z.coerce
        .number()
        .int('Số lượng bài nộp phải là số nguyên')
        .min(0, 'Số lượng bài nộp không được nhỏ hơn 0')
})

export type SingleAssignGradingInput = z.input<typeof singleAssignGradingSchema>
export type SingleAssignGradingType = z.output<typeof singleAssignGradingSchema>

interface UseSingleAssignGradingProps {
    gradingSessionId: string
    onRefresh: () => void
}

export default function useSingleAssignGrading({
    gradingSessionId,
    onRefresh
}: UseSingleAssignGradingProps) {
    const { execute, loading } = useApiCall()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<
        SingleAssignGradingInput,
        unknown,
        SingleAssignGradingType
    >({
        resolver: zodResolver(singleAssignGradingSchema),
        defaultValues: {
            staffId: '',
            numberSubmissions: 0
        }
    })

      const onSubmit = async (
      assignGradingForm: SingleAssignGradingType
      ): Promise<boolean> => {
      const body = {
            staffId: assignGradingForm.staffId,
            numberSubmissions: assignGradingForm.numberSubmissions
      }

      try {
            const data = await execute({
                  apiUrl: `/grading-sessions/${gradingSessionId}/assignments`,
                  method: 'post',
                  type: 'private',
                  body
            })

            if (data.error) {
                  toast.error(data.error.message)
                  return false
            }

            onRefresh()
            toast.success('Phân công giảng viên thành công')

            return true
      } catch {
            toast.error('Phân công giảng viên thất bại')
            return false
      }
      }

    return {
        register,
        handleSubmit,
        errors,
        loading,
        onSubmit
    }
}