import { FiSearch, FiArrowUp, FiArrowDown, FiPlus } from 'react-icons/fi'
import type { SemesterStatus } from '../types/semester'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'

export type SortField = 'startDate' | 'name'
export type SortDirection = 'asc' | 'desc'

interface SemestersToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  statusFilter: SemesterStatus | 'all'
  onStatusFilterChange: (v: SemesterStatus | 'all') => void
  sortField: SortField
  sortDirection: SortDirection
  onSortFieldChange: (v: SortField) => void
  onToggleSortDirection: () => void
  onCreateClick: () => void
}

const statusOptions: { value: SemesterStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 0, label: 'Sắp diễn ra' },
  { value: 1, label: 'Đang hoạt động' },
  { value: 2, label: 'Đã kết thúc' },
]

const sortFieldLabels: Record<SortField, string> = {
  startDate: 'Ngày bắt đầu',
  name: 'Tên học kỳ',
}

export default function SemestersToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  sortDirection,
  onSortFieldChange,
  onToggleSortDirection,
  onCreateClick,
}: SemestersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Input 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên hoặc mã học kỳ..."
            icon={FiSearch} 
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
          <Button
            onClick={onToggleSortDirection}
            variant='basic'
            size='basic'
            aria-label="Đổi chiều sắp xếp"
            title={sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}
          >
            {sortDirection === 'asc' ? (
              <FiArrowUp className="w-4 h-4" />
            ) : (
              <FiArrowDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <Button
        size='basic'
        variant='default'
        onClick={onCreateClick}
        className="w-fit"
      >
        <FiPlus className="w-4 h-4" />
        Tạo học kỳ
      </Button>
    </div>
  )
}