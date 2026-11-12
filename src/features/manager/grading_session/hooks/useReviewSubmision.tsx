
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const reviewSubmissionSchema = z.object({
  baseHistoryId: z.string().uuid(),
  generalFeedback: z.string(),
  items: z.array(
    z.object({
      parsedAnswerId: z.string().uuid(),
      score: z.number().min(0),
      comment: z.string(),
    }),
  ),
})

type ReviewSubmissionInputType = z.input<
  typeof reviewSubmissionSchema
>

type ReviewSubmissionOutputType = z.output<
  typeof reviewSubmissionSchema
>

type UseReviewSubmissionType = {
  submissionId?: string
  onRefreshSubmissionDetail: () => void
}

export default function useReviewSubmission({
  submissionId,
  onRefreshSubmissionDetail,
}: UseReviewSubmissionType) {
  const { execute, loading } = useApiCall()

  const {
    control,
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<
    ReviewSubmissionInputType,
    unknown,
    ReviewSubmissionOutputType
  >({
    resolver: zodResolver(reviewSubmissionSchema),
    defaultValues: {
      baseHistoryId: '',
      generalFeedback: '',
      items: [],
    },
  })

  const {
    append,
    fields,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: 'items',
  })

const submitReview = async (values: ReviewSubmissionOutputType) => {
    if (!submissionId) return

    const response = await execute({
        apiUrl: `submissions/${submissionId}/grading/review`,
        method: 'post',
        type: 'private',
        body: values,
    })

    if (response.error) {
        toast.error(response.error.message)
        return
    }

    toast.success('Cập nhật kết quả chấm điểm thành công')
    onRefreshSubmissionDetail()
    reset()
}

  return {
    loading,
    handleSubmit,
    submitReview,
    control,
    register,
    resetReviewSubmission: reset,
    appendReviewItem: append,
    removeReviewItem: remove,
    replaceReviewItems: replace,
    reviewItemFields: fields,
    errors,
  }
}
