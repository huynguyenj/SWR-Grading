import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import type { OfficialSubmission } from '../types/official_submission'
import { useEffect, useState } from 'react'

export default function useGetOfficialSubmissions() {
  const { execute, loading } =
    useApiCall<PaginationType<OfficialSubmission>>()

  const [officialSubmissionDataList, setOfficialSubmissionDataList] =
    useState<PaginationType<OfficialSubmission>>()

  const [currentOfficialSubmissionPage, setCurrentOfficialSubmissionPage] =
    useState(1)

  const [pageOfficialSubmissionSize, setPageOfficialSubmissionSize] =
    useState(10)

  const [examinationId, setExaminationId] = useState('')
  const [semesterId, setSemesterId] = useState('')

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const getOfficialSubmissionList = async () => {
      const data = await execute({
        apiUrl: 'manager/reports/official-submissions',
        method: 'get',
        type: 'private',
        body: {
          Page: currentOfficialSubmissionPage,
          PageSize: pageOfficialSubmissionSize,
          ...(examinationId && { examinationId }),
          ...(semesterId && { semesterId }),
        },
      })

      if (data?.data) {
        setOfficialSubmissionDataList(data.data)
      }
    }

    getOfficialSubmissionList()
  }, [
    currentOfficialSubmissionPage,
    pageOfficialSubmissionSize,
    examinationId,
    semesterId,
    refreshKey,
  ])

  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    officialSubmissionDataList,
    loading,

    currentOfficialSubmissionPage,
    pageOfficialSubmissionSize,
    setCurrentOfficialSubmissionPage,
    setPageOfficialSubmissionSize,

    examinationId,
    semesterId,
    setExaminationId,
    setSemesterId,

    refresh,
  }
}