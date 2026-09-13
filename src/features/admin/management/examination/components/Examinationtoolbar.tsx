import { FiSearch, FiArrowUp, FiArrowDown, FiPlus } from 'react-icons/fi'
import type { ExamSessionStatus } from '../types/examination.type'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import type { SemesterType } from '../../semester/types/semester'

export type SortField = 'examDate' | 'name'
export type SortDirection = 'asc' | 'desc'

interface ExamSessionsToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  semesterFilter: string
  onSemesterFilterChange: (v: string) => void
  statusFilter: ExamSessionStatus | 'all'
  onStatusFilterChange: (v: ExamSessionStatus | 'all') => void
  sortField: SortField
  sortDirection: SortDirection
  onSortFieldChange: (v: SortField) => void
  onToggleSortDirection: () => void
  semesters: SemesterType[]
  onCreateClick: () => void
}

const statusOptions: { value: ExamSessionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Nháp' },
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'ongoing', label: 'Đang diễn ra' },
  { value: 'completed', label: 'Đã kết thúc' },
  { value: 'cancelled', label: 'Đã hủy' },
]

const sortFieldLabels: Record<SortField, string> = {
  examDate: 'Ngày thi',
  name: 'Tên đợt thi',
}

export default function ExamSessionsToolbar({
  search,
  onSearchChange,
  semesterFilter,
  onSemesterFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  sortDirection,
  onSortFieldChange,
  onToggleSortDirection,
  semesters,
  onCreateClick,
}: ExamSessionsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            value={search}
            size='basic'
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên đợt thi..."
          />
        </div>

        <select
          value={semesterFilter}
          onChange={(e) => onSemesterFilterChange(e.target.value)}
          className="rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
        >
          <option value="all">Tất cả học kỳ</option>
          {semesters.map((s) => (
            <option key={s.semesterId} value={s.semesterId}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as ExamSessionStatus | 'all')}
          className="rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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
        onClick={onCreateClick}
        size='sm'
      >
        <FiPlus className="w-4 h-4" />
        Tạo đợt thi
      </Button>
    </div>
  )
}