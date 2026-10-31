import { useEffect,  useState } from 'react'
import useApiCall from '@/hooks/useApiCall'
import type { SemesterStatistics } from '../types/admin_dashboard.type'

export default function useGetSemesterStatistics() {
  const { execute, loading } = useApiCall<SemesterStatistics[]>()
  const [semesters, setSemesters] = useState<SemesterStatistics[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchStatistics = async () => {
      try {
        setError(null)

        const response = await execute({
          apiUrl: '/admin/dashboard/semesters-statistics',
          method: 'get',
          type: 'private',
        })

        if (cancelled) return

        if (response.error) {
          setError('Không thể tải thống kê học kỳ.')
          return
        }

        if (!response.data) {
          setError('API không trả về dữ liệu thống kê học kỳ.')
          return
        }

        setSemesters(response.data)
      } catch {
        if (!cancelled) {
          setError('Đã xảy ra lỗi khi tải thống kê học kỳ.')
        }
      }
    }

    fetchStatistics()

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const refresh =() => {
    setRefreshKey((previous) => previous + 1)
  }

  return {
    semesters,
    loading,
    error,
    refresh,
  }
}