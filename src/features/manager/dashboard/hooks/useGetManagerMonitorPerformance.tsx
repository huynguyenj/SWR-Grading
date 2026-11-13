
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import type { ManagerMonitorPerformanceResponseType } from '../types/manager_monitor_performance'
import useDebounce from '@/hooks/useDebounce'

interface UseGetManagerMonitorPerformanceProps {
  semesterId?: string | null
  examinationId?: string | null
  search?: string
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
      const data = await execute({
            apiUrl: '/manager/reports/monitor-performance',
            method: 'get',
            type: 'private',
            body: {
            Page: currentPage,
            PageSize: pageSize,
            ...(semesterId ? { semesterId } : {}),
            ...(examinationId ? { examinationId } : {}),
            ...(debouncedSearch.trim()
            ? { search: debouncedSearch.trim() }
            : {}),
            },
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

    setCurrentPage,
    setPageSize,
    setSearch,
    refresh,
  }
}
