
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

import useApiCall from '@/hooks/useApiCall'

// Assign grading schema
const AssignGradingSchema = z.object({
    monitors: z
        .array(
            z.string().uuid('Giảng viên không hợp lệ'),
        )
        .min(1, 'Vui lòng chọn ít nhất một giảng viên'),

    submissionPerMonitor: z.coerce
        .number()
        .int('Số lượng bài nộp phải là số nguyên')
        .min(0, 'Số lượng bài nộp không được nhỏ hơn 0'),
})

type AssignGradingInput = z.input<typeof AssignGradingSchema>
type AssignGradingOutput = z.output<typeof AssignGradingSchema>

interface UseAssignGradingProps {
    gradingSessionId: string
    onRefresh: () => void
}

export default function useMultipleAssignment({
    gradingSessionId,
    onRefresh,
}: UseAssignGradingProps) {
    const { execute, loading } = useApiCall()

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm<
        AssignGradingInput,
        unknown,
        AssignGradingOutput
    >({
        resolver: zodResolver(AssignGradingSchema),
        defaultValues: {
            monitors: [],
            submissionPerMonitor: 0,
        },
    })

    // Selected monitor IDs
    const selectedMonitorIds = watch('monitors')

    // Add monitor to selected list
    const addMonitor = (monitorId: string) => {
        if (!monitorId) return

        const currentMonitors = getValues('monitors')

        // Prevent duplicate monitors
        if (currentMonitors.includes(monitorId)) {
            toast.info('Giảng viên này đã được chọn.')
            return
        }

        setValue(
            'monitors',
            [...currentMonitors, monitorId],
            {
                shouldValidate: true,
                shouldDirty: true,
            },
        )
    }

    // Remove monitor from selected list
    const removeMonitor = (monitorId: string) => {
        const currentMonitors = getValues('monitors')

        setValue(
            'monitors',
            currentMonitors.filter((id) => id !== monitorId),
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
            apiUrl: `grading-sessions/${gradingSessionId}/assignments`,
            method: 'post',
            type: 'private',
            body: {
                monitors: formData.monitors,
                submissionPerMonitor: formData.submissionPerMonitor,
            },
        })

        if (response.error) {
            toast.error(response.error.message)
            return false
        }

        toast.success('Phân công giảng viên thành công!')
        onRefresh()
        reset()
        return true
    }

    return {
        // React Hook Form
        register,
        handleSubmit,
        errors,
        // Loading
        loading,
        // Selected monitors
        selectedMonitorIds,
        addMonitor,
        removeMonitor,
        // Form actions
        onSubmit,
        reset,
    }
}
