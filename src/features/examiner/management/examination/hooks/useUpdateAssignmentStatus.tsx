
import { useCallback } from 'react'
import { z } from 'zod'

import useApiCall from '@/hooks/useApiCall'
import { toast } from 'react-toastify'

export const AssignmentStatusSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
])

export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>

export const UpdateAssignmentSchema = z.object({
  gradingSessionId: z.string().uuid('Grading session ID không hợp lệ'),
  assignmentId: z.string().uuid('Assignment ID không hợp lệ'),
  staffId: z.string().uuid('Staff ID không hợp lệ'),
  status: AssignmentStatusSchema,
})

export type UpdateAssignmentInput = z.infer<
  typeof UpdateAssignmentSchema
>

export default function useUpdateAssignmentStatus() {
  const { execute, loading } = useApiCall()
  
  const updateAssignmentStatus = useCallback(
    async (input: UpdateAssignmentInput): Promise<boolean> => {
      // Validate dữ liệu trước khi gọi API.
      const validation = UpdateAssignmentSchema.safeParse(input)

      if (!validation.success) {
        return false
      }

      const {
        gradingSessionId,
        assignmentId,
        staffId,
        status,
      } = validation.data

        const response = await execute({
          apiUrl: `grading-sessions/${gradingSessionId}/assignments/${assignmentId}`,
          method: 'put',
          type: 'private',
          body: {
            staffId,
            status,
          },
        })

        if (response.error) {
          toast.error(response.error.message)
          return false
        }
        toast.success('Cập nhật trạng thái thành công')
        return true
    },
    [],
  )

  return {
    updateAssignmentStatus,
    loading,
  }
}
