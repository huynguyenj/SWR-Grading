import type { SemesterDetailType } from "@/features/admin/management/semester/types/semester"
import useApiCall from "@/hooks/useApiCall"
import { useEffect, useState } from "react"

export default function useGetExamMaterialBySemester({ semesterId }: { semesterId: string }) {
  const { execute, loading} = useApiCall<SemesterDetailType>()
  const [lecturerSemesterDetail, setLecturerSemesterDetail] = useState<SemesterDetailType>()
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
   const handleGetSemesterLecturerDetail = async () => {
     const response = await execute({
      apiUrl: `semesters/${semesterId}`,
      method: 'get',
      type: 'private',
     })
     setLecturerSemesterDetail(response.data)
   }
   handleGetSemesterLecturerDetail()
  }, [semesterId, refreshKey])
  const onRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }
  return { loading, lecturerSemesterDetail, onRefresh }
}
