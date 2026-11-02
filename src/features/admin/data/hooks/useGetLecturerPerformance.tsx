import { useCallback, useEffect,  useState } from 'react'
import useApiCall from '@/hooks/useApiCall'
import type { LecturerPerformance } from '../types/admin_dashboard.type'

interface UseGetLecturersPerformanceProps {
  semesterId: string
}

export default function useGetLecturersPerformance({
  semesterId,
}: UseGetLecturersPerformanceProps) {
  const { execute, loading } = useApiCall<LecturerPerformance[]>()
  const [lecturers, setLecturers] = useState<LecturerPerformance[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchPerformance = async () => {
      if (!semesterId) {
        setLecturers([])
        setError(null)
        return
      }


        const response = await execute({
          apiUrl: `/admin/dashboard/lecturers-performance?semesterId=${encodeURIComponent(semesterId)}`,
          method: 'get',
          type: 'private',
        })

        if (cancelled) return

        if (response.error) {
          setError('Không thể tải hiệu suất giảng viên.')
          return
        }

        if (!response.data) {
          setError('API không trả về dữ liệu hiệu suất giảng viên.')
          return
        }

        setLecturers(response.data)
        
    }

    void fetchPerformance()

    return () => {
      cancelled = true
    }
  }, [semesterId, refreshKey])

  const refresh = useCallback(() => {
    setRefreshKey((previous) => previous + 1)
  }, [])

  return {
    lecturers,
    loading,
    error,
    refresh,
  }
}