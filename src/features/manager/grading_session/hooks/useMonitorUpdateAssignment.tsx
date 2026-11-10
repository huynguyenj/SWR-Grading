
import { useState } from 'react'
import { z } from 'zod'
import { toast } from 'react-toastify'

import useApiCall from '@/hooks/useApiCall'
import { useAuthStore } from '@/features/authentication/store/auth-store'

// Assignment status enum
export const AssignmentStatusSchema = z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4)
])

export type AssignmentStatus = z.infer<
    typeof AssignmentStatusSchema
>

// Validate API request
const UpdateAssignmentSchema = z.object({
    gradingSessionId: z.string().uuid('Grading session ID không hợp lệ'),
    assignmentId: z.string().uuid('Assignment ID không hợp lệ'),
    staffId: z.string().uuid('Staff ID không hợp lệ'),
    status: AssignmentStatusSchema
})

export type UpdateAssignmentInput = {
    gradingSessionId: string
    assignmentId: string
    status: AssignmentStatus
}

export default function useMonitorUpdateAssignment() {
    const { execute, loading } = useApiCall()

    const staffId = useAuthStore((state) => state.userId)

    const [isUpdating, setIsUpdating] = useState(false)

    const updateAssignmentStatus = async (
        input: UpdateAssignmentInput
    ): Promise<boolean> => {
        // Prevent concurrent update requests
        if (isUpdating || loading) return false

        // Validate staff ID
        if (!staffId) {
            toast.error('Không tìm thấy userId')
            return false
        }

        // Validate request using Zod
        const validation = UpdateAssignmentSchema.safeParse({
            ...input,
            staffId
        })

        if (!validation.success) {
            toast.error(
                validation.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ'
            )
            return false
        }

        const {
            gradingSessionId,
            assignmentId,
            staffId: validatedStaffId,
            status
        } = validation.data

        setIsUpdating(true)

        try {
            const response = await execute({
                apiUrl: `/grading-sessions/${gradingSessionId}/assignments/${assignmentId}`,
                method: 'put',
                type: 'private',
                body: {
                    staffId: validatedStaffId,
                    status
                }
            })

            if (!response || response.error) {
                toast.error(
                    response?.error?.message ||
                    'Cập nhật trạng thái thất bại'
                )
                return false
            }

            toast.success('Cập nhật trạng thái thành công')
            return true
        } catch (error) {
            console.error('Update assignment status error:', error)
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái')
            return false
        } finally {
            setIsUpdating(false)
        }
    }

    return {
        updateAssignmentStatus,
        loading,
        isUpdating
    }
}
