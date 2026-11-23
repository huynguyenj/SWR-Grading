
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import type { ManagerMonitorPerformanceResponseType } from '../types/manager_monitor_performance'
import useDebounce from '@/hooks/useDebounce'

interface UseGetManagerMonitorPerformanceProps {
  semesterId?: string | null
  examinationId?: string | null
}

export default function useGetManagerMonitorPerformance({
  semesterId,
  examinationId,
}: UseGetManagerMonitorPerformanceProps = {}) {
      const { execute, loading } =
      useApiCall<ManagerMonitorPerformanceResponseType>()

      const [monitorPerformance, setMonitorPerformance] =
      useState<ManagerMonitorPerformanceResponseType>()

      const [currentPage, setCurrentPage] = useState(1)
      const [pageSize, setPageSize] = useState(10)

      const [refreshKey, setRefreshKey] = useState(0)
      const [search, setSearch] = useState('')
      const debouncedSearch = useDebounce(search, 400)

  // Fetch monitor performance
      useEffect(() => {
      const getMonitorPerformance = async () => {

      const params = new URLSearchParams()

      params.set('Page', String(currentPage))
      params.set('PageSize', String(pageSize))

      if (semesterId) {
        params.set('semesterId', semesterId)
      }

      if (examinationId) {
        params.set('examinationId', examinationId)
      }

      if (debouncedSearch.trim()) {
        params.set('search', debouncedSearch.trim())
      }

      const queryString = params.toString()
      const data = await execute({
            apiUrl: `/manager/reports/monitor-performance?${queryString}`,
            method: 'get',
            type: 'private',
      })

      setMonitorPerformance(data.data)
      }

      getMonitorPerformance()
      }, [currentPage,pageSize,semesterId,examinationId,debouncedSearch,refreshKey])

  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    monitorPerformance,
    loading,

    currentPage,
    pageSize,
    search,
    setCurrentPage,
    setPageSize,
    setSearch,
    refresh,
  }
}
