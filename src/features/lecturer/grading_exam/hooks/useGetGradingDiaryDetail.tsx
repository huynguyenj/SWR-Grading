import useApiCall from "@/hooks/useApiCall"
import { useState } from "react"
import { toast } from "react-toastify"
import type { GradingDiaryDetailType } from "../types/grading-diary.type"

export default function useGetGradingDiaryDetail() {
  const { execute, loading } = useApiCall<GradingDiaryDetailType>()
  const [diaryDetail, setDiaryDetail] = useState<GradingDiaryDetailType>()
  const handleGetDiaryDetail = async (diaryId: string) => {
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

  return { loading, diaryDetail, handleGetDiaryDetail,  }
}
