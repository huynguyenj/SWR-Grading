import { useEffect, useState } from 'react'

interface UsePaginationOptions {
  /** Số dòng mỗi trang khi khởi tạo. Mặc định 10. */
  initialPageSize?: number
  /** Trang khởi tạo. Mặc định 1. */
  initialPage?: number
  totalPages?: number
}

export interface UsePaginationResult {
  /** Dữ liệu đã được cắt theo trang hiện tại — dùng render trực tiếp vào bảng */
  currentPage: number
  pageSize: number
  totalPages: number
  /** Nhảy tới 1 trang cụ thể, tự động giới hạn trong [1, totalPages] */
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  /** Đổi số dòng/trang, tự động quay về trang 1 để tránh lệch dữ liệu */
  changePageSize: (size: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Hook phân trang dùng chung — nhận vào 1 mảng dữ liệu (đã filter/sort xong)
 * và trả về phần dữ liệu của trang hiện tại cùng các hàm điều khiển.
 *
 * Dùng kết hợp với component <Pagination /> ở cùng thư mục:
 *
 * ```tsx
 * const pagination = usePagination(filteredData, { initialPageSize: 10 })
 * <Table data={pagination.paginatedData} />
 * <Pagination
 *   currentPage={pagination.currentPage}
 *   totalPages={pagination.totalPages}
 *   onPageChange={pagination.goToPage}
 *   totalItems={pagination.totalItems}
 *   pageSize={pagination.pageSize}
 *   onPageSizeChange={pagination.changePageSize}
 * />
 * ```
 */
export function usePagination(
  { initialPageSize = 10, initialPage = 1, totalPages = 1 }: UsePaginationOptions = {},
): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)


  // Nếu dữ liệu bị lọc nhỏ lại (VD: đổi filter) khiến trang hiện tại vượt quá
  // tổng số trang mới, tự động kéo về trang cuối cùng hợp lệ.
  useEffect(() => {
    const getCurrentPage = () => {
          if (currentPage > totalPages) {
            setCurrentPage(totalPages)
          }
    }
    getCurrentPage()
  }, [totalPages, currentPage])

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * pageSize
//     return data.slice(start, start + pageSize)
//   }, [data, currentPage, pageSize])

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
  }

  function nextPage() {
    goToPage(currentPage + 1)
  }

  function prevPage() {
    goToPage(currentPage - 1)
  }

  function changePageSize(size: number) {
    setPageSize(size)
    setCurrentPage(1)
  }

  return {
//     paginatedData,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }
}