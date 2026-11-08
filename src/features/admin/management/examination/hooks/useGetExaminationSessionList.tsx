import type { ExaminationSessionType } from '@/features/examiner/management/examination/types/exam_session'
import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import { useEffect, useState } from 'react'

export default function useGetExaminationSessionList() {
  const { execute, loading } = useApiCall<PaginationType<ExaminationSessionType>>()
  const [examinationSessionDataList, setExaminationSessionDataList] = useState<PaginationType<ExaminationSessionType>>()
  const [currentExaminationSessionPage, setCurrentExaminationSessionPage] = useState(1)
  const [pageExaminationSessionSize, setPageExaminationSessionSize] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const getExaminationList = async () => {
      const data = await execute({
        apiUrl: `examination-sessions?Page=${currentExaminationSessionPage}&PageSize=${pageExaminationSessionSize}`,
        method: 'get',
        type: 'private',
      })
      setExaminationSessionDataList(data.data)
    }
    getExaminationList()
  }, [currentExaminationSessionPage, pageExaminationSessionSize, refreshKey])

  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    examinationSessionDataList,
    loading,
    currentExaminationSessionPage,
    pageExaminationSessionSize,
    setCurrentExaminationSessionPage,
    setPageExaminationSessionSize,
    refresh,
  }
}
