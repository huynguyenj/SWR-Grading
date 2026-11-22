
import type { ExaminationStatus } from "@/features/admin/management/examination/types/examination.type"
import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const examinationSessionSchema = z.object({
    examinationCode: z.string().min(1, "Mã đợt thi không được để trống"),
    startDate: z.string().min(1, "Ngày thi không được để trống"),
    startTime: z.string().min(1, "Giờ bắt đầu không được để trống"),
    status: z.string().min(1, "Vui lòng chọn trạng thái"),
})

type UpdateExaminationSessionInput = z.input<
    typeof examinationSessionSchema
>

type UpdateExaminationSessionType = z.output<
    typeof examinationSessionSchema
>

interface UseUpdateExaminationSessionProps {
    onRefresh: () => void
}

export default function useUpdateExaminationSession({
    onRefresh,
}: UseUpdateExaminationSessionProps) {
    const { execute, loading } = useApiCall()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<
        UpdateExaminationSessionInput,
        unknown,
        UpdateExaminationSessionType
    >({
        resolver: zodResolver(examinationSessionSchema),
    })

    const [selectedExaminationId, setSelectedExaminationId] = useState("")
    const [selectedSessionId, setSelectedSessionId] = useState("")

    const onSubmit = async (
        updateSessionForm: UpdateExaminationSessionType,
    ): Promise<boolean> => {
        const body = {
            examinationCode: updateSessionForm.examinationCode.trim(),
            startDate: updateSessionForm.startDate,
            startTime:
                updateSessionForm.startTime.length === 5
                    ? `${updateSessionForm.startTime}:00`
                    : updateSessionForm.startTime,
            status: Number(updateSessionForm.status) as ExaminationStatus,
        }

        const response = await execute({
            apiUrl: `/examinations/${selectedExaminationId}/sessions/${selectedSessionId}`,
            method: "put",
            type: "private",
            body,
        })

        if (response.error) {
            toast.error(response.error.message)
            return false
        }

        onRefresh()
        toast.success("Cập nhật đợt thi thành công")

        return true
    }

    return {
        updateRegister: register,
        handleSubmit,
        errors,
        loading,
        onSubmit,
        reset,
        control,
        setSelectedExaminationId,
        setSelectedSessionId,
    }
}
