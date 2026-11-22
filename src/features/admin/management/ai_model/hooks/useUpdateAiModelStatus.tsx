import useApiCall from "@/hooks/useApiCall"
import type { UpdateAiModelStatusPayload } from "../types/ai_model_type"

export default function useUpdateAiModelStatus() {
  const { execute, loading } = useApiCall()

  const updateStatus = async (
    modelId: string,
    status: boolean,
  ): Promise<boolean> => {
    const payload: UpdateAiModelStatusPayload = { status }

    const response = await execute({
      apiUrl: `ai-models/${modelId}/status`,
      method: 'patch',
      type: 'private',
      body: payload,
    })

    return Boolean(response)
  }

  return {
    updateStatus,
    loading,
  }
}