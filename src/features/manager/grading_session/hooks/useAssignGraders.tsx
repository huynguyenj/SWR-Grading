import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import useApiCall from "@/hooks/useApiCall"

// Assignment schema: each monitor has its own submission count
const AssignGradingSchema = z.object({
    monitors: z
        .array(
            z.object({
                monitorId: z.string().uuid("Giảng viên không hợp lệ"),
                numberSubmission: z.coerce
                    .number()
                    .int("Số lượng bài nộp phải là số nguyên")
                    .min(0, "Số lượng bài nộp không được nhỏ hơn 0"),
            }),
        )
        .min(1, "Vui lòng chọn ít nhất một giảng viên"),
})

type AssignGradingInput = z.input<typeof AssignGradingSchema>
type AssignGradingOutput = z.output<typeof AssignGradingSchema>

interface UseMultipleAssignmentProps {
    gradingSessionId: string
    onRefresh: () => void
}

export default function useAssignGraders({
    gradingSessionId,
    onRefresh,
}: UseMultipleAssignmentProps) {
    const { execute, loading } = useApiCall()

    const {
        handleSubmit,
        watch,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm<AssignGradingInput, unknown, AssignGradingOutput>({
        resolver: zodResolver(AssignGradingSchema),
        defaultValues: {
            monitors: [],
        },
    })

    // Selected monitor assignments
    const selectedAssignments = watch("monitors")

    // IDs for compatibility with the component
    const selectedMonitorIds = selectedAssignments.map(
        (assignment) => assignment.monitorId,
    )

    // Add monitor to selected list
    const addMonitor = (monitorId: string) => {
        if (!monitorId) return

        const currentAssignments = getValues("monitors")

        // Prevent duplicate monitors
        if (
            currentAssignments.some(
                (assignment) => assignment.monitorId === monitorId,
            )
        ) {
            toast.info("Giảng viên này đã được chọn.")
            return
        }

        setValue(
            "monitors",
            [
                ...currentAssignments,
                {
                    monitorId,
                    numberSubmission: 0,
                },
            ],
            {
                shouldValidate: true,
                shouldDirty: true,
            },
        )
    }

    // Remove monitor
    const removeMonitor = (monitorId: string) => {
        const currentAssignments = getValues("monitors")

        setValue(
            "monitors",
            currentAssignments.filter(
                (assignment) => assignment.monitorId !== monitorId,
            ),
            {
                shouldValidate: true,
                shouldDirty: true,
            },
        )
    }

    // Update submission count for a monitor
    const setSubmissionCount = (
        monitorId: string,
        numberSubmission: number,
    ) => {
        const currentAssignments = getValues("monitors")

        setValue(
            "monitors",
            currentAssignments.map((assignment) =>
                assignment.monitorId === monitorId
                    ? { ...assignment, numberSubmission }
                    : assignment,
            ),
            {
                shouldValidate: true,
                shouldDirty: true,
            },
        )
    }

    // Submit assignment
    const onSubmit = async (
        formData: AssignGradingOutput,
    ): Promise<boolean> => {
        const response = await execute({
            apiUrl: `grading-sessions/${gradingSessionId}/assignments/auto`,
            method: "post",
            type: "private",
            body: formData.monitors,
        })

        if (response.error) {
            toast.error(response.error.message)
            return false
        }

        toast.success("Phân công giảng viên thành công!")
        onRefresh()
        reset()

        return true
    }

    return {
        // React Hook Form
        handleSubmit,
        errors,

        // Loading
        loading,

        // Selected monitors
        selectedMonitorIds,
        selectedAssignments,
        addMonitor,
        removeMonitor,
        setSubmissionCount,

        // Form actions
        onSubmit,
        reset,
    }
}