
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import useDebounce from '@/hooks/useDebounce'

import type { PaginationType } from '@/types/pagination.type'
import type { ExaminerStudent } from '../types/examiner_student'

export default function useGetExaminerStudents() {
  const { execute, loading } =
    useApiCall<PaginationType<ExaminerStudent>>()

  const [examinerStudentDataList, setExaminerStudentDataList] =
    useState<PaginationType<ExaminerStudent>>()

  const [currentStudentPage, setCurrentStudentPage] = useState(1)
  const [pageStudentSize, setPageStudentSize] = useState(10)

  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  // Debounce search input
  const debouncedSearch = useDebounce(search, 500)
  const [examinationId, setExaminationId] = useState<string>('')
  const [semesterId, setSemesterId] = useState<string>('')

  // Reset page when search changes
  useEffect(() => {
   const loadPage = () => {
         setCurrentStudentPage(1)
   }
   loadPage()
  }, [debouncedSearch])

  // Fetch Examiner students
  useEffect(() => {
    const getExaminerStudentList = async () => {
      const params = new URLSearchParams({
        Page: String(currentStudentPage),
        PageSize: String(pageStudentSize),
      })

      if (debouncedSearch.trim()) {
        params.set('Search', debouncedSearch.trim())
      }

      if (examinationId) {
        params.set('ExaminationId', examinationId)
      }

      if (semesterId) {
        params.set('SemesterId', semesterId)
      }

      const data = await execute({
        apiUrl: `admin/students?${params.toString()}`,
        method: 'get',
        type: 'private',
      })

      if (data?.data) {
        setExaminerStudentDataList(data.data)
      }
    }

    getExaminerStudentList()
  }, [
    currentStudentPage,
    pageStudentSize,
    debouncedSearch,
    refreshKey,
    semesterId,
    examinationId
  ])

  // Refresh data
  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    examinerStudentDataList,
    loading,

    currentStudentPage,
    pageStudentSize,
    setCurrentStudentPage,
    setPageStudentSize,

    search,
    setSearch,

    refresh,
    setExaminationId,
    setSemesterId,
    examinationId,
    semesterId
  }
}
