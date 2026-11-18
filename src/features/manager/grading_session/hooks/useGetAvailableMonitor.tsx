
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import useDebounce from '@/hooks/useDebounce'

import type { PaginationType } from '@/types/pagination.type'
import type { ManagerAvailableMonitor } from '../../monitor/types/manager_monitor'

export default function useGetAvailableManagerMonitors() {
  const { execute, loading } =
    useApiCall<PaginationType<ManagerAvailableMonitor>>()

  const [managerMonitorDataList, setmanagerMonitorDataList] =
    useState<PaginationType<ManagerAvailableMonitor>>()

  const [currentMonitorPage, setCurrentMonitorPage] = useState(1)
  const [pageMonitorSize, setPageMonitorSize] = useState(10)

  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  // Debounce search input
  const debouncedSearch = useDebounce(search, 500)
  const [isBusySearch, setIsBusySearch] = useState(false)
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
      if (isBusySearch) {
        params.set('IsBusy', String(isBusySearch))
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
    isBusySearch
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
    
    isBusySearch,
    search,
    setSearch,
    setIsBusySearch,

    refresh,
  }
}
