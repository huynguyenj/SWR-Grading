import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import useApiCall from '@/hooks/useApiCall'
import type { CreateAiModelPayload } from '../types/ai_model_type'


const createAiModelSchema = z.object({
  name: z.string().min(1, 'Vui lòng chọn AI model'),

  apiKey: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập API Key'),

  price: z
    .string()
    .min(1, 'Vui lòng nhập giá')
    .refine((value) => {
      const price = Number(value)
      return Number.isFinite(price) && price >= 0
    }, 'Giá phải là số hợp lệ và không được âm'),

  status: z.boolean(),
})

export type CreateAiModelFormValues = z.infer<
  typeof createAiModelSchema
>

interface UseCreateAiModelProps {
  onRefresh?: () => void
}

export default function useCreateAiModel({
  onRefresh,
}: UseCreateAiModelProps = {}) {
  const { execute, loading } = useApiCall()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAiModelFormValues>({
    resolver: zodResolver(createAiModelSchema),
    defaultValues: {
      name: '',
      apiKey: '',
      price: '',
      status: false,
    },
  })

  const onSubmit = async (
    formData: CreateAiModelFormValues,
  ): Promise<boolean> => {
    const payload: CreateAiModelPayload = {
      name: formData.name,
      apiKey: formData.apiKey.trim(),
      price: Number(formData.price),
      status: formData.status,
    }

    const response = await execute({
      apiUrl: 'ai-models',
      method: 'post',
      type: 'private',
      body: payload,
    })

    if (!response) return false

    onRefresh?.()

    return true
  }

  return {
    register,
    handleSubmit,
    errors,
    loading,
    watch,
    setValue,
    reset,
    onSubmit,
  }
}