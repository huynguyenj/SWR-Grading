
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import type { ManagerAiHumanStatisticsType, ManagerScoreDistributionFilterType } from '../types/manager_dashboard'



export default function useGetManagerAiHumanStatistics({
  examinationId,
  semesterId,
}: ManagerScoreDistributionFilterType = {}) {
  const { execute, loading } =
    useApiCall<ManagerAiHumanStatisticsType>()

  const [statistics, setStatistics] =
    useState<ManagerAiHumanStatisticsType>()

  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const getStatistics = async () => {
      setError(null)

      const params = new URLSearchParams()

      if (examinationId) {
        params.set('examinationId', examinationId)
      }

      if (semesterId) {
        params.set('semesterId', semesterId)
      }

      const queryString = params.toString()

      try {
        const response = await execute({
          apiUrl: `manager/reports/ai-human-statistics${
            queryString ? `?${queryString}` : ''
          }`,
          method: 'get',
          type: 'private',
        })

        if (cancelled) return

        if (response.error) {
          setError(response.error.message)
          setStatistics(undefined)
          return
        }

        setStatistics(response.data)
      } catch {
        if (cancelled) return

        setError(
          'Không thể tải thống kê so sánh AI và giảng viên. Vui lòng thử lại.',
        )
        setStatistics(undefined)
      }
    }

    void getStatistics()

    return () => {
      cancelled = true
    }
  }, [examinationId, semesterId, refreshKey])

  const refresh = () => {
    setRefreshKey((previous) => previous + 1)
  }

  return {
    statistics,
    loading,
    error,
    refresh,
  }
}
