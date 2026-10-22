import useApiCall from "@/hooks/useApiCall"
import type { PaginationType } from "@/types/pagination.type"
import type { PaperSetType } from "../../examination_materials/types/exam_material.type"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/features/authentication/store/auth-store"

export default function useGetPaperSetForLecturer() {
  const { execute, loading } = useApiCall<PaginationType<PaperSetType>>()
  const userId = useAuthStore().userId
  const [paperSetDataList, setPaperSetDataList] = useState<PaginationType<PaperSetType>>()
  const [currentPaperSetPage, setCurrentPaperSetPage] = useState(1)
  const [pagePaperSetSize, setPagePaperSetSize] = useState(5)
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    const getPaperSetList = async () => {
      const data = await execute({
            apiUrl: `paper-sets/lecturer/${userId}?Page=${currentPaperSetPage}&PageSize=${pagePaperSetSize}`,
            method: 'get',
            type: 'private',
      })
      
      setPaperSetDataList(data.data)
    }
    getPaperSetList()
  }, [currentPaperSetPage, pagePaperSetSize, refreshKey])
  const refresh = () => {
      setRefreshKey(prev => prev + 1)
  }
  return { currentPaperSetPage, pagePaperSetSize, paperSetDataList, loading, refresh, setCurrentPaperSetPage, setPagePaperSetSize }
}
