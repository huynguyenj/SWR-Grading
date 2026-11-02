
import useApiCall from '@/hooks/useApiCall'
import useDebounce from '@/hooks/useDebounce'
import type { PaginationType } from '@/types/pagination.type'
import type { LecturerType } from '../types/lecturer.type'
import { useEffect, useState } from 'react'

export default function useGetLecturerList() {
  const { execute, loading } = useApiCall<PaginationType<LecturerType>>()
  const [lecturerDataList, setLecturerDataList] = useState<PaginationType<LecturerType>>()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [currentLecturerPage, setCurrentLecturerPage] = useState(1)
  const [pageLecturerSize, setPageLecturerSize] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const getLecturerList = async () => {
      const params = new URLSearchParams({
        Search: debouncedSearch,
        Page: String(currentLecturerPage),
        PageSize: String(pageLecturerSize),
      })

      const data = await execute({
        apiUrl: `/admin/lecturers?${params.toString()}`,
        method: 'get',
        type: 'private',
      })

      if (data?.data) {
        setLecturerDataList(data.data)
      }
    }

    getLecturerList()
  }, [debouncedSearch,currentLecturerPage,pageLecturerSize,refreshKey])

  const refresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return {
    lecturerDataList,
    loading,
    search,
    setSearch,
    currentLecturerPage,
    pageLecturerSize,
    setCurrentLecturerPage,
    setPageLecturerSize,
    refresh,
  }
}
