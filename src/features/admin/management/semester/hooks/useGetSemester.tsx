import useApiCall from "@/hooks/useApiCall"
import type { PaginationType } from "@/types/pagination.type"
import type { SemesterType } from "../types/semester"
import { useEffect, useState } from "react"

export default function useGetSemester() {
  const { execute, loading } = useApiCall<PaginationType<SemesterType>>()
  const [semesterDataList, setSemesterDataList] = useState<PaginationType<SemesterType>>()
  const [currentSemesterPage, setCurrentSemesterPage] = useState(1)
  const [pageSemesterSize, setPageSemesterSize] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    const getSemesterList = async () => {
      const data = await execute({
            apiUrl: '/semesters',
            method: 'get',
            type: 'private',
            body: {
                  Page: currentSemesterPage,
                  PageSize: pageSemesterSize
            }
      })
      console.log(data.data);
      
      setSemesterDataList(data.data)
    }
    getSemesterList()
  }, [currentSemesterPage, pageSemesterSize, refreshKey])
  const refresh = () => {
      setRefreshKey(prev => prev + 1)
  }
  return { semesterDataList, loading, currentSemesterPage, pageSemesterSize, setCurrentSemesterPage, setPageSemesterSize, refresh }
}
