import useApiCall from "@/hooks/useApiCall"
import { toast } from "react-toastify"

export default function useMonitorAiGrade() {
  const { execute, loading } = useApiCall()
  const handleAIGrade = async (submissionId: string) => {
      const response = await execute({
            apiUrl: `submissions/${submissionId}/grading/ai`,
            method: 'post',
            type: 'private'
      })
      if (response.error) {
            toast.error(response.error.message)
            return
      }
      toast.success('Chấm điểm thành công')
  }
  return { handleAIGrade, loading }
}
