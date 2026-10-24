import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

/**
 * GIẢ ĐỊNH endpoint — chưa được cung cấp trong yêu cầu, cần xác nhận lại với BE.
 * Tạm dùng PUT /grading-diaries/submissions/{submissionId}/score
 */
const updateSubmissionScoreSchema = z.object({
  lecturerScore: z.number(),
  comment: z.string(),
  pickAiScore: z.boolean().default(true),
  isFinal: z.boolean().default(false),
  selectionReason: z.string(),
  itemDetails: z.array(
    z.object({
      questionId: z.string(),
      score: z.number(),
      comment: z.string(),
      notRecognized: z.string().nullable()
    }),
  ),
})
type UpdateSubmissionScoreSchemaInputType = z.input<typeof updateSubmissionScoreSchema>
type UpdateSubmissionScoreSchemaOutputType = z.output<typeof updateSubmissionScoreSchema>

export default function useUpdateSubmissionScore({ submissionId, onRefresh }: { submissionId?: string, onRefresh: (submissionId: string) => void }) {
  const { execute, loading } = useApiCall()
  const {
  control,
  register,
  formState: { errors },
  handleSubmit,
} = useForm<
  UpdateSubmissionScoreSchemaInputType,
  unknown,
  UpdateSubmissionScoreSchemaOutputType
>({
  resolver: zodResolver(updateSubmissionScoreSchema),
  defaultValues: {
    lecturerScore: 0,
    comment: '',
    pickAiScore: true,
    isFinal: false,
    selectionReason: '',
    itemDetails: [],
  },
})
  const { append, fields, remove } = useFieldArray({ control, name: 'itemDetails' })

 const onSubmit = async (values: UpdateSubmissionScoreSchemaInputType) => {
    if (!submissionId) return
    console.log(values);
    
    const response = await execute({
      apiUrl: `submissions/${submissionId}/review`,
      method: 'post',
      type: 'private',
      body: values,
    })
    if (response.error) {
      toast.error(response.error.message)
      return
    }
    toast.success('Chấm điểm thành công')
    onRefresh(submissionId)
 }
  return { loading, handleSubmit, onSubmit, control, register, appendQuestionFix: append, removeQuestionFix: remove, questionFixField: fields, errors }
}