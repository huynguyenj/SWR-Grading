import { useEffect, useState } from 'react'
import type { PaginationType } from '@/types/pagination.type'
import useApiCall from '@/hooks/useApiCall'
import type { AiModel } from '../types/ai_model_type'

interface UseGetAiModelsProps {
  initialPage?: number
  initialPageSize?: number
}

export default function useGetAiModels({
  initialPage = 1,
  initialPageSize = 10,
}: UseGetAiModelsProps = {}) {
  const { execute, loading } = useApiCall<PaginationType<AiModel>>()

  const [data, setData] = useState<PaginationType<AiModel>>()
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  useEffect(() => {
    const fetchAiModels = async () => {
      const params = new URLSearchParams({
        Page: String(page),
        PageSize: String(pageSize),
      })

      const response = await execute({
        apiUrl: `ai-models?${params.toString()}`,
        method: 'get',
        type: 'private',
      })

      if (response?.data) {
        setData(response.data)
      }
    }

    void fetchAiModels()
  }, [page, pageSize, refreshKey])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  return {
    data,
    loading,
    page,
    pageSize,
    setPage,
    setPageSize,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  }
}