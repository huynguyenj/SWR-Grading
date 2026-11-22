
import useApiCall from "@/hooks/useApiCall"
import { toast } from "react-toastify"
import z from "zod"

const UpdateMonitorReviewSchema = z.object({
UpdateMonitorScore: z.number().min(0),
    comment: z.string(),
    pickAiScore: z.boolean(),
    isFinal: z.boolean(),
    itemDetails: z.array(
        z.object({
            questionId: z.string().uuid(),
            score: z.number().min(0),
            comment: z.string(),
        }),
    ),
})

export type UpdateMonitorReviewType = z.infer<
    typeof UpdateMonitorReviewSchema
>

interface UseUpdateMonitorReviewProps {
    submissionId?: string
    onRefreshSubmissionDetail: () => void
}

export default function useUpdateMonitorReview({
    submissionId,
    onRefreshSubmissionDetail,
}: UseUpdateMonitorReviewProps) {
    const { execute, loading } = useApiCall()

    const updateMonitorReview = async (
        values: UpdateMonitorReviewType,
    ): Promise<boolean> => {
        if (!submissionId) return false

        const validated = UpdateMonitorReviewSchema.safeParse(values)

        if (!validated.success) {
            toast.error("Dữ liệu chấm điểm không hợp lệ")
            return false
        }

        const response = await execute({
            apiUrl: `submissions/${submissionId}/review`,
            method: "post",
            type: "private",
            body: validated.data,
        })

        if (response.error) {
            toast.error(response.error.message)
            return false
        }

        toast.success("Cập nhật điểm giảng viên thành công")
        onRefreshSubmissionDetail()

        return true
    }

    return {
        loading,
        updateMonitorReview,
    }
}
