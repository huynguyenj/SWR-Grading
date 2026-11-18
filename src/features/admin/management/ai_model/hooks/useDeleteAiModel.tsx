import useApiCall from "@/hooks/useApiCall"
import { toast } from "react-toastify"

export default function useDeleteAiModel() {
  const { execute, loading } = useApiCall()
  const handleDeleteAiModel = async (modelId: string) => {
      const response = await execute({
            apiUrl: `ai-models/${modelId}`,
            method: 'del',
            type:'private'
      })
      if (response.error) {
            toast.error(response.error.message)
            return false
      }
      toast.success('Xóa AI model thành công')
      return true
  }
  return { handleDeleteAiModel, deleteLoading: loading }
}
