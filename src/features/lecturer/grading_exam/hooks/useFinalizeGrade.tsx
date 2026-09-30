import useApiCall from '@/hooks/useApiCall'
import { toast } from 'react-toastify'

/**
 * GIẢ ĐỊNH endpoint — chưa được cung cấp trong yêu cầu, cần xác nhận lại với BE.
 * Tạm dùng PUT /grading-diaries/submissions/{submissionId}/score
 */
export default function useFinalizeScore() {
  const { execute, loading } = useApiCall()

  const finalizeScore = async (submissionId: string) => {
    const response = await execute({
      apiUrl: `submissions/${submissionId}/finalize`,
      method: 'put',
      type: 'private',
    })

    if (response.error) {
      toast.error(response.error.message)
      return false
    }

    toast.success('Lưu điểm thành công')
    return true
  }

  return { finalizeScore, loading }
}