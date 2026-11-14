import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import type {
  ApplicationStatus,
  ApplicationType,
} from '@/features/student/application/types/application_type'

interface UseGetManagerApplicationListProps {
  examinationSessionId: string
  status: ApplicationStatus | 'all'
}

export default function useGetManagerApplicationList({
  examinationSessionId,
  status,
}: UseGetManagerApplicationListProps) {
  const { execute, loading } =
    useApiCall<PaginationType<ApplicationType>>()

  const [applicationDataList, setApplicationDataList] =
    useState<PaginationType<ApplicationType>>()

  // Pagination state
  const [currentApplicationPage, setCurrentApplicationPage] =
    useState(1)

  const [pageApplicationSize, setPageApplicationSize] =
    useState(10)

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const getApplicationList = async () => {
      const params = new URLSearchParams({
        Page: String(currentApplicationPage),
        PageSize: String(pageApplicationSize),
      })

      // Examination session filter
      if (examinationSessionId !== 'all') {
        params.set('examinationSessionId', examinationSessionId)
      }

      // Status filter
      if (status !== 'all') {
        params.set('status', String(status))
      }

      const data = await execute({
        apiUrl: `applications?${params.toString()}`,
        method: 'get',
        type: 'private',
      })

      if (data?.data) {
        setApplicationDataList(data.data)
      }
    }

    void getApplicationList()
  }, [ currentApplicationPage, pageApplicationSize, examinationSessionId, status, refreshKey])

  // Refresh application list
  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    applicationDataList,
    loading,
    currentApplicationPage,
    pageApplicationSize,
    setCurrentApplicationPage,
    setPageApplicationSize,
    refresh,
  }
}