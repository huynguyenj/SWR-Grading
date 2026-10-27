import { useEffect, useState } from 'react'
import useApiCall from '@/hooks/useApiCall'
import type { LecturerDashboardType } from '../types/dashboard.type'

interface UseGetLecturerDashboardProps {
  semesterId: string
}

export default function useGetLecturerDashboard({
  semesterId,
}: UseGetLecturerDashboardProps) {
  const { execute, loading } = useApiCall<LecturerDashboardType>()

  const [dashboard, setDashboard] = useState<LecturerDashboardType>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const getDashboard = async () => {
      setDashboard(undefined)
      setError(null)
      if (semesterId === 'all') {
        return
      }
      try {
        const response = await execute({
          apiUrl: `lecturer/dashboard?semesterId=${semesterId}`,
          method: 'get',
          type: 'private',
        })

        if (cancelled) return

        if (response.error) {
          setError(response.error.message)
          return
        }

        setDashboard(response.data)
      } catch {
        if (!cancelled) {
          setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.')
        }
      }
    }

    void getDashboard()

    return () => {
      cancelled = true
    }
  }, [semesterId])

  return {
    dashboard,
    loading,
    error,
  }
}