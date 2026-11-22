import useApiCall from "@/hooks/useApiCall"
import type { MonitorType } from "../types/monitor_type"
import { useEffect, useState } from "react"

export default function useGetStaffList() {
  const { execute, loading } = useApiCall<MonitorType[]>()
  const [monitorList, setMonitorList] = useState<MonitorType[]>()
  const [refreshKey, setRefreshKey] = useState(0)
  
  useEffect(() => {
      const getAssignmentList = async () =>  {
        const response = await execute({
          apiUrl: `auth/monitors`,
          method: 'get',
          type: 'private'
        })
        setMonitorList(response.data)
      }
      getAssignmentList()
    }, [refreshKey])
  const refresh = () => {
      setRefreshKey(prev => prev + 1)
  }
  return { monitorList, loading, refresh }
}
