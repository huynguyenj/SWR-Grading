import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import type { SupportedAiModel } from '../types/ai_model_type'

interface UseGetSupportedAiModelsProps {
  enabled?: boolean
  initialPage?: number
  initialPageSize?: number
}

export default function useGetSupportedAiModels({
  enabled = true,
  initialPage = 1,
  initialPageSize = 10,
}: UseGetSupportedAiModelsProps = {}) {
  const { execute, loading } =
    useApiCall<PaginationType<SupportedAiModel>>()

  const [data, setData] =
    useState<PaginationType<SupportedAiModel> | null>(null)

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const getSupportedAiModels = async () => {
      const params = new URLSearchParams({
        Page: String(currentPage),
        PageSize: String(pageSize),
      })

      const response = await execute({
        apiUrl: `ai-models/supported?${params.toString()}`,
        method: 'get',
        type: 'private',
      })

      if (response?.data) {
        setData(response.data)
      }
    }

    void getSupportedAiModels()
  }, [enabled, currentPage, pageSize, refreshKey])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    data,
    supportedAiModels: data?.items ?? [],
    loading,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  }
}