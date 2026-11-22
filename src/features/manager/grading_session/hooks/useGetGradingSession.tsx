import useApiCall from "@/hooks/useApiCall"
import type { GradingSessionType } from "../types/grading_session_type"
import type { PaginationType } from "@/types/pagination.type"
import { useEffect, useState } from "react"

export default function useGetGradingSession() {
  const { execute, loading } = useApiCall<PaginationType<GradingSessionType>>()
  const [gradingSessionDataList, setGradingSessionDataList] = useState<PaginationType<GradingSessionType>>()
  const [currentGradingSessionPage, setCurrentGradingSessionPage] = useState(1)
  const [pageGradingSessionSize, setPageGradingSessionSize] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    const getGradingSessionList = async () => {
      const data = await execute({
            apiUrl: 'grading-sessions',
            method: 'get',
            type: 'private',
            body: {
                  Page: currentGradingSessionPage,
                  PageSize: pageGradingSessionSize
            }
      })
      
      setGradingSessionDataList(data.data)
    }
    getGradingSessionList()
  }, [currentGradingSessionPage, pageGradingSessionSize, refreshKey])
  const refresh = () => {
      setRefreshKey(prev => prev + 1)
  }
  return { gradingSessionDataList, loading, currentGradingSessionPage, pageGradingSessionSize, setCurrentGradingSessionPage, setPageGradingSessionSize, refresh }
}
