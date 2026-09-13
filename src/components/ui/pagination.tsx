import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi'

export interface PaginationProps {
  currentPage: number
  totalPages?: number
  /** Dùng khi bấm trực tiếp vào số trang (1, 2, 3...) */
  onPageChange: (page: number) => void
  /**
   * Dùng cho nút mũi tên trái/phải. Nối trực tiếp với `pagination.prevPage`
   * và `pagination.nextPage` từ hook usePagination.
   */
  /** Nếu truyền vào, hiện dòng "Hiển thị X-Y trong Z kết quả" */
  totalItems?: number
  pageSize?: number
  /** Nếu truyền vào, hiện dropdown đổi số dòng/trang */
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
}

const ELLIPSIS = 'ellipsis' as const

/**
 * Tính danh sách số trang cần hiển thị, có rút gọn bằng "..." khi nhiều trang.
 * VD: current=5, total=10 -> [1, '...', 4, 5, 6, '...', 10]
 */
function getPageNumbers(current: number, total: number): (number | typeof ELLIPSIS)[] {
  const delta = 1 // số trang liền kề current được hiện full
  const range: (number | typeof ELLIPSIS)[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  range.push(1)
  if (left > 2) range.push(ELLIPSIS)
  for (let i = left; i <= right; i++) range.push(i)
  if (right < total - 1) range.push(ELLIPSIS)
  if (total > 1) range.push(total)

  return range
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages ? totalPages : 1)

  const rangeStart = totalItems !== undefined && pageSize ? (currentPage - 1) * pageSize + 1 : null
  const rangeEnd =
    totalItems !== undefined && pageSize ? Math.min(currentPage * pageSize, totalItems) : null
  function nextPage() {
    onPageChange(currentPage + 1)
  }

  function prevPage() {
    onPageChange(currentPage - 1)
  }

  function changePageSize(size: number) {
    onPageChange(size)
    onPageChange(1)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Thông tin số dòng + đổi page size */}
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        {rangeStart !== null && rangeEnd !== null && totalItems !== undefined && (
          <span>
            Hiển thị <span className="font-medium text-text-primary">{rangeStart}</span>–
            <span className="font-medium text-text-primary">{rangeEnd}</span> trong{' '}
            <span className="font-medium text-text-primary">{totalItems}</span> kết quả
          </span>
        )}

        {onPageSizeChange && pageSize && (
          <select
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="rounded-md border border-border-default bg-bg-primary px-2 py-1 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} dòng/trang
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Điều hướng trang */}
      <div className="flex items-center gap-1">
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="flex items-center justify-center rounded-md border border-border-default p-2 text-text-secondary hover:bg-bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Trang trước"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((page, i) =>
          page === ELLIPSIS ? (
            <span
              key={`ellipsis-${i}`}
              className="flex items-center justify-center w-8 h-8 text-text-muted"
            >
              <FiMoreHorizontal className="w-4 h-4" />
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={[
                'flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-brand-orange text-white'
                  : 'text-text-secondary hover:bg-bg-muted',
              ].join(' ')}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={nextPage}
          disabled={currentPage >= (totalPages ? totalPages : 1)}
          className="flex items-center justify-center rounded-md border border-border-default p-2 text-text-secondary hover:bg-bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Trang sau"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}