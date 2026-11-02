import { useCallback, useEffect, useRef, useState } from 'react'
import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import type { SemesterType } from '@/features/admin/management/semester/types/semester'

const PAGE_SIZE = 10

export default function useGetSemesterOptions() {
  const { execute, loading } = useApiCall<PaginationType<SemesterType>>()

  const [semesters, setSemesters] = useState<SemesterType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(true)

  const nextPageRef = useRef(1)
  const loadingRef = useRef(false)
  const hasNextRef = useRef(true)
  const loadedIdsRef = useRef(new Set<string>())

  const loadNextPage = useCallback(async () => {
    // Ngăn gọi trùng khi người dùng scroll liên tục.
    if (loadingRef.current || !hasNextRef.current) return

    loadingRef.current = true
    setError(null)

    try {
      const response = await execute({
        apiUrl: '/semesters',
        method: 'get',
        type: 'private',
        body: {
          Page: nextPageRef.current,
          PageSize: PAGE_SIZE,
        },
      })

      if (response.error) {
        setError(response.error.message)
        return
      }

      const result = response.data

      if (!result) {
        setError('Không nhận được dữ liệu học kỳ.')
        return
      }

      const newSemesters = result.items.filter((semester) => {
        if (loadedIdsRef.current.has(semester.semesterId)) {
          return false
        }

        loadedIdsRef.current.add(semester.semesterId)
        return true
      })

      setSemesters((previous) => [...previous, ...newSemesters])

      nextPageRef.current = result.page + 1
      hasNextRef.current = result.hasNext
      setHasNext(result.hasNext)
    } catch {
      setError('Không thể tải danh sách học kỳ. Vui lòng thử lại.')
    } finally {
      loadingRef.current = false
    }
  }, [execute])

  // Chỉ tải trang đầu tiên khi component sử dụng hook được mount.
  useEffect(() => {
    void loadNextPage()
  }, [loadNextPage])

  return {
    semesters,
    loading,
    error,
    hasNext,
    loadNextPage,
  }
}