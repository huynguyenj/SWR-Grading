import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'
const updateItemDetailSchema = z.object({
      score: z.number(),
      comment: z.string(),
      notRecognized: z.string()
})
type ItemDetailSchemaType = z.infer<typeof updateItemDetailSchema>
export default function useUpdateSubmissionItemDetail() {
  const { register: updateItemRegister, handleSubmit:handleSubmitItem, reset: resetItems } = useForm<ItemDetailSchemaType>({ resolver: zodResolver(updateItemDetailSchema) })
  const { execute, loading: updateItemLoading } = useApiCall()
  const onSubmit = async (detailId: string, values: ItemDetailSchemaType) => {
      const response = await execute({
            apiUrl: `submissions/item-details/${detailId}`,
            method: 'put',
            type: 'private',
            body: values
      })
      if (response.error) {
            toast.error(response.error.message)
            return false
      }
      toast.success('Cập nhật thành công')
      return true
  }
  return { handleSubmitItem, resetItems, updateItemLoading, onSubmit, updateItemRegister  }
}
