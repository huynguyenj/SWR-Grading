import useApiCall from '@/hooks/useApiCall'
import { toast } from 'react-toastify'

/**
 * GIẢ ĐỊNH endpoint — chưa được cung cấp trong yêu cầu, cần xác nhận lại với BE.
 * Tạm dùng PUT /grading-diaries/submissions/{submissionId}/score
 */
export default function useUpdateSubmissionScore() {
  const { execute, loading } = useApiCall()

  const updateScore = async (submissionId: string, lecturerScore: number, comment: string) => {
    const response = await execute({
      apiUrl: `submissions/${submissionId}/review`,
      method: 'put',
      type: 'private',
      body: { lecturerScore, comment },
    })

    if (response.error) {
      toast.error(response.error.message)
      return false
    }

    toast.success('Lưu điểm thành công')
    return true
  }

  return { updateScore, loading }
}