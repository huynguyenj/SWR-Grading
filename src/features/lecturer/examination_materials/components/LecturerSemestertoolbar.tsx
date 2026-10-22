import type { SemesterStatus } from '@/features/admin/management/semester/types/semester'
import { FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi'

export type SortField = 'startDate' | 'name'
export type SortDirection = 'asc' | 'desc'

interface LecturerSemestersToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  statusFilter: SemesterStatus | 'all'
  onStatusFilterChange: (v: SemesterStatus | 'all') => void
  sortField: SortField
  sortDirection: SortDirection
  onSortFieldChange: (v: SortField) => void
  onToggleSortDirection: () => void
}

const statusOptions: { value: SemesterStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 0, label: 'Sắp diễn ra' },
  { value: 1, label: 'Đang diễn ra' },
  { value: 2, label: 'Đã kết thúc' },
]

const sortFieldLabels: Record<SortField, string> = {
  startDate: 'Ngày bắt đầu',
  name: 'Tên học kỳ',
}

/**
 * Toolbar dành riêng cho Lecturer — chỉ có search/filter/sort,
 * KHÔNG có nút "Tạo học kỳ" vì lecturer chỉ được xem, không được tạo/sửa/xóa.
 */
export default function LecturerSemestersToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  sortDirection,
  onSortFieldChange,
  onToggleSortDirection,
}: LecturerSemestersToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên hoặc mã học kỳ..."
          className="w-full rounded-md border border-border-default bg-bg-primary pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as SemesterStatus | 'all')}
        className="rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <div className="flex items-center gap-1">
        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
        >
          {Object.entries(sortFieldLabels).map(([value, label]) => (
            <option key={value} value={value}>
              Sắp xếp: {label}
            </option>
          ))}
        </select>
        <button
          onClick={onToggleSortDirection}
          className="rounded-md border border-border-default p-2 text-text-secondary hover:bg-bg-muted transition-colors"
          aria-label="Đổi chiều sắp xếp"
          title={sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}
        >
          {sortDirection === 'asc' ? (
            <FiArrowUp className="w-4 h-4" />
          ) : (
            <FiArrowDown className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}