
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

import useApiCall from '@/hooks/useApiCall'
import type { ApplicationStatus } from '@/features/student/application/types/application_type'

const updateApplicationStatusSchema = z.object({
    status: z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
    ]),
})

type UpdateApplicationStatusInput = z.input<
    typeof updateApplicationStatusSchema
>

type UpdateApplicationStatusType = z.output<
    typeof updateApplicationStatusSchema
>

interface UseUpdateApplicationStatusProps {
    applicationId: string
    currentStatus: ApplicationStatus
    onRefresh: () => void
}

export default function useUpdateManagerApplicationStatus({
    applicationId,
    currentStatus,
    onRefresh,
}: UseUpdateApplicationStatusProps) {
    const { execute, loading } = useApiCall()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<
        UpdateApplicationStatusInput,
        unknown,
        UpdateApplicationStatusType
    >({
        resolver: zodResolver(updateApplicationStatusSchema),
        defaultValues: {
            status: currentStatus,
        },
    })

    // Sync form when application status changes
    useEffect(() => {
        reset({
            status: currentStatus,
        })
    }, [currentStatus, applicationId, reset])

    const onSubmit = async (
        formData: UpdateApplicationStatusType,
    ): Promise<boolean> => {
        // Do not call API if status remains unchanged
        if (formData.status === currentStatus) {
            return true
        }

        const data = await execute({
            apiUrl: `/applications/${applicationId}/status`,
            method: 'put',
            type: 'private',
            body: {
                status: formData.status,
            },
        })

        if (data.error) {
            toast.error(data.error.message)
            return false
        }

        toast.success('Cập nhật trạng thái đơn thành công')

        onRefresh()
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
