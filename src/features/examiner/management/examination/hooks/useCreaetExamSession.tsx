import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const examSessionSchema = z.object({
  ExaminationCode: z.string().min(1, 'Mã đợt thi không được để trống'),
  StartDate: z.string().optional(),
  StartTime: z.string().optional(),
  Status: z.coerce.number().default(0),
  PaperSetId: z.string().optional(),
  File: z.instanceof(File, { error: 'File không được để trống' }),
})

type CreateExamSessionInput = z.input<typeof examSessionSchema>
export type CreateExamSessionType = z.output<typeof examSessionSchema>

export default function useCreateExamSession({
  examinationId,
  onRefresh,
}: {
  examinationId: string
  onRefresh?: () => void
}) {
  const { execute, loading } = useApiCall()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateExamSessionInput, unknown, CreateExamSessionType>({
    resolver: zodResolver(examSessionSchema),
    defaultValues: {
      ExaminationCode: '',
      StartDate: '',
      StartTime: '',
      Status: 0,
      PaperSetId: '',
    },
  })

  /** Trả về true nếu tạo thành công */
  const onSubmit = async (values: CreateExamSessionType): Promise<boolean> => {
    // Có file trong payload -> gửi multipart/form-data
    const formData = new FormData()
    formData.append('ExaminationCode', values.ExaminationCode)
    if (values.StartDate) formData.append('StartDate', values.StartDate)
    if (values.StartTime) {
      // <input type="time"> trả "HH:mm" -> chuẩn hóa về "HH:mm:ss" cho khớp kiểu time của API
      formData.append('StartTime', values.StartTime.length === 5 ? `${values.StartTime}:00` : values.StartTime)
    }
    formData.append('Status', String(values.Status))
    if (values.PaperSetId) formData.append('PaperSetId', values.PaperSetId)
    formData.append('File', values.File)

    const response = await execute({
      apiUrl: `examinations/${examinationId}/sessions/import`,
      method: 'post',
      type: 'private',
      body: formData,
    })

    if (response.error) {
      toast.error(response.error.message)
      return false
    }

    onRefresh?.()
    toast.success('Tạo ca thi thành công')
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
    // input file không dùng register() được -> set thủ công
    setFile: (file: File | null) => setValue('File', file as File, { shouldValidate: true }),
  }
}