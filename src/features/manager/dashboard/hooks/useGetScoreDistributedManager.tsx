
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import type { ManagerScoreDistributionFilterType, ManagerScoreDistributionType } from '../types/manager_dashboard'



export default function useGetManagerScoreDistribution({
  examinationId,
  semesterId,
}: ManagerScoreDistributionFilterType = {}) {
  const { execute, loading } =
    useApiCall<ManagerScoreDistributionType>()

  const [scoreDistribution, setScoreDistribution] =
    useState<ManagerScoreDistributionType>()

  const [error, setError] = useState<string | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const getScoreDistribution = async () => {
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
          apiUrl: `manager/reports/score-distribution${
            queryString ? `?${queryString}` : ''
          }`,
          method: 'get',
          type: 'private',
        })

        if (cancelled) return

        if (response.error) {
          setError(response.error.message)
          setScoreDistribution(undefined)
          return
        }

        setScoreDistribution(response.data)
      } catch {
        if (cancelled) return

        setError(
          'Không thể tải dữ liệu phổ điểm. Vui lòng thử lại.',
        )
        setScoreDistribution(undefined)
      }
    }

    void getScoreDistribution()

    return () => {
      cancelled = true
    }
  }, [examinationId, semesterId, refreshKey])

  const refresh = () => {
    setRefreshKey((previous) => previous + 1)
  }

  return {
    scoreDistribution,
    loading,
    error,
    refresh,
  }
}
