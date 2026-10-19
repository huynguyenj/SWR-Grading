import useApiCall from '@/hooks/useApiCall'
import { useState } from 'react'
import { toast } from 'react-toastify'
import type { RubricType } from '../types/rubric.type'

export default function useGetRubrics() {
  const { execute, loading } = useApiCall<RubricType[]>()
  const [rubrics, setRubrics] = useState<RubricType[]>()

  const handleGetRubrics = async (paperSetId: string) => {
    // Xóa dữ liệu của bộ đề trước để modal không hiện nhầm rubric cũ trong lúc tải
    setRubrics(undefined)
    const response = await execute({
      apiUrl: `rubrics?paperSetId=${paperSetId}`,
      method: 'get',
      type: 'private',
    })
    if (response.error) {
      toast.error(response.error.message)
      return
    }
    setRubrics(response.data)
  }

  return { rubrics, handleGetRubrics, loading }
}