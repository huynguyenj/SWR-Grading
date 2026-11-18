import useApiCall from "@/hooks/useApiCall"
import type { UpdateAiModelPayload } from "../types/ai_model_type"

export default function useUpdateAiModel() {
  const { execute, loading } = useApiCall()

  const updateAiModel = async (
    modelId: string,
    payload: UpdateAiModelPayload,
  ): Promise<boolean> => {
    const response = await execute({
      apiUrl: `ai-models/${modelId}`,
      method: 'put',
      type: 'private',
      body: payload,
    })

    return Boolean(response)
  }

  return {
    updateAiModel,
    loading,
  }
}