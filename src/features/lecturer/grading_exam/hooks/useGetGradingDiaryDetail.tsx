import useApiCall from "@/hooks/useApiCall"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import type { GradingDiaryDetailType } from "../types/grading-diary.type"

type UseGradingDiaryDetailType = {
  diaryId: string
}

export default function useGetGradingDiaryDetail({ diaryId }: UseGradingDiaryDetailType) {
  const { execute, loading } = useApiCall<GradingDiaryDetailType>()
  const [diaryDetail, setDiaryDetail] = useState<GradingDiaryDetailType>()
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
      const handleGetDiaryDetail = async () => {
      const response = await execute({
            apiUrl: `grading-diaries/${diaryId}`,
            method: 'get',
            type: 'private'
      })
      if (response.error) {
            toast.error(response.error.message)
            return
      }
      setDiaryDetail(response.data)
  }
      handleGetDiaryDetail()
  }, [refreshKey])
  const refresh = () => {
      setRefreshKey(prev => prev + 1)
  }
  return { loading, diaryDetail, refresh }
}
