
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import useDebounce from '@/hooks/useDebounce'

import type { PaginationType } from '@/types/pagination.type'
import type { ManagerMonitor } from '../types/manager_monitor'

export default function useGetManagerMonitors() {
  const { execute, loading } =
    useApiCall<PaginationType<ManagerMonitor>>()

  const [managerMonitorDataList, setmanagerMonitorDataList] =
    useState<PaginationType<ManagerMonitor>>()

  const [currentMonitorPage, setCurrentMonitorPage] = useState(1)
  const [pageMonitorSize, setPageMonitorSize] = useState(10)

  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  // Debounce search input
  const debouncedSearch = useDebounce(search, 500)

  // Reset page when search changes
  useEffect(() => {
   const loadPage = () => {
         setCurrentMonitorPage(1)
   }
   loadPage()
  }, [debouncedSearch])

  // Fetch manager Monitors
  useEffect(() => {
    const getmanagerMonitorList = async () => {
      const params = new URLSearchParams({
        Page: String(currentMonitorPage),
        PageSize: String(pageMonitorSize),
      })

      if (debouncedSearch.trim()) {
        params.set('Search', debouncedSearch.trim())
      }

      const data = await execute({
        apiUrl: `manager/monitors?${params.toString()}`,
        method: 'get',
        type: 'private',
      })

      if (data?.data) {
        setmanagerMonitorDataList(data.data)
      }
    }

    getmanagerMonitorList()
  }, [
    currentMonitorPage,
    pageMonitorSize,
    debouncedSearch,
    refreshKey,
  ])

  // Refresh data
  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    managerMonitorDataList,
    loading,

    currentMonitorPage,
    pageMonitorSize,
    setCurrentMonitorPage,
    setPageMonitorSize,

    search,
    setSearch,

    refresh,
  }
}
