
import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

export const lecturerGradingSchema = z.object({
    generalFeedback: z.string(),
    items: z.array(
        z.object({
            questionNumber: z.number().int().nonnegative(),
            score: z.number().finite().min(0, "Điểm không được nhỏ hơn 0"),
            comment: z.string(),
        }),
    ),
})

export type LecturerGradingInputType = z.input<
    typeof lecturerGradingSchema
>

export type LecturerGradingOutputType = z.output<
    typeof lecturerGradingSchema
>

interface UseLecturerGradingProps {
    submissionId?: string
    onRefreshSubmissionDetail: () => void
}

export default function useLecturerGrading({
    submissionId,
    onRefreshSubmissionDetail,
}: UseLecturerGradingProps) {
    const { execute, loading } = useApiCall()

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<
        LecturerGradingInputType,
        unknown,
        LecturerGradingOutputType
    >({
        resolver: zodResolver(lecturerGradingSchema),
        defaultValues: {
            generalFeedback: "",
            items: [],
        },
    })

    const submitLecturerGrading = async (
        values: LecturerGradingOutputType,
    ): Promise<boolean> => {
        if (!submissionId) {
            toast.error("Không tìm thấy mã bài nộp.")
            return false
        }

        const response = await execute({
            apiUrl: `submissions/${submissionId}/grading/lecturer`,
            method: "post",
            type: "private",
            body: values,
        })

        if (response.error) {
            toast.error(response.error.message)
            return false
        }

        toast.success("Chấm điểm thủ công thành công.")

        onRefreshSubmissionDetail()
        reset()

        return true
    }

    return {
        loading,
        control,
        register,
        handleSubmit,
        errors,
        submitLecturerGrading,
        resetLecturerGrading: reset,
    }
}
