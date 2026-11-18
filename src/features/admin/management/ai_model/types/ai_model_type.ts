export interface AiModel {
  modelId: string
  name: string
  apiKeyMasked: string
  hasApiKey: boolean
  status: boolean
  isSelected: boolean
  price: number
}

export interface CreateAiModelPayload {
  name: string
  apiKey: string
  price: number
  status: boolean
}

export type SupportedAiModel = string

export interface UpdateAiModelPayload {
  name: string
  apiKey: string
  price: number
}

export interface UpdateAiModelStatusPayload {
  status: boolean
}