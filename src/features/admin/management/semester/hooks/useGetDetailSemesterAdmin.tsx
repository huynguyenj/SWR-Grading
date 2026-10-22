import useApiCall from '@/hooks/useApiCall'
import { useEffect, useState } from 'react'
import type { SemesterDetailType } from '../types/semester'

export default function useGetSemesterDetail(semesterId: string) {
  const { execute, loading } = useApiCall<SemesterDetailType>()
  const [semesterDetail, setSemesterDetail] = useState<SemesterDetailType>()

  useEffect(() => {
    if (!semesterId) {
      return
    }

    const getSemesterDetail = async () => {
      const response = await execute({
        apiUrl: `/semesters/${semesterId}`,
        method: 'get',
        type: 'private',
      })
      setSemesterDetail(response.data)
    }
    getSemesterDetail()
  }, [semesterId])

  return { semesterDetail, loading }
}