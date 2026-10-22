import useApiCall from "@/hooks/useApiCall"
import type { PaginationType } from "@/types/pagination.type"
import type { GradingDiaryType } from "../types/grading-diary.type"
import { useEffect, useState } from "react"

export default function useGetGradingDiary() {
  const { execute, loading } = useApiCall<PaginationType<GradingDiaryType>>()
  const [gradingDiaryList, setGradingDiaryList] = useState<PaginationType<GradingDiaryType>>()
  const [currentSemesterPage, setCurrentSemesterPage] = useState(1)
  const [pageSemesterSize, setPageSemesterSize] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
      const handleGetGradingDiaryList = async () => {
            const response = await execute({
                  apiUrl: `grading-diaries?Page=${currentSemesterPage}&PageSize=${pageSemesterSize}`,
                  method: 'get',
                  type: 'private'
            })
            setGradingDiaryList(response.data)
      }
      handleGetGradingDiaryList()
  }, [currentSemesterPage, pageSemesterSize, refreshKey])
  const refresh = () => {
      setRefreshKey(prev => prev + 1)
  }
  return { gradingDiaryList, loading, currentSemesterPage, pageSemesterSize, setCurrentSemesterPage, setPageSemesterSize, refresh }
}
