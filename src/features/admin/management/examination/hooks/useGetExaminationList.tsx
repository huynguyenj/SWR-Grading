import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import type { ExaminationType } from '../types/examination.type'
import { useEffect, useState } from 'react'

export default function useGetExaminationList() {
  const { execute, loading } = useApiCall<PaginationType<ExaminationType>>()
  const [examinationDataList, setExaminationDataList] = useState<PaginationType<ExaminationType>>()
  const [currentExaminationPage, setCurrentExaminationPage] = useState(1)
  const [pageExaminationSize, setPageExaminationSize] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const getExaminationList = async () => {
      const data = await execute({
        apiUrl: `examinations?Page=${currentExaminationPage}&PageSize=${pageExaminationSize}`,
        method: 'get',
        type: 'private',
      })
      setExaminationDataList(data.data)
    }
    getExaminationList()
  }, [currentExaminationPage, pageExaminationSize, refreshKey])

  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    examinationDataList,
    loading,
    currentExaminationPage,
    pageExaminationSize,
    setCurrentExaminationPage,
    setPageExaminationSize,
    refresh,
  }
}