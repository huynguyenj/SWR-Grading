import {
  FiRefreshCw,
  FiSearch,
} from 'react-icons/fi'

import ExamSessionSelect from '@/features/manager/application/components/ExamSessionSelect'

interface ManagerApplicationToolbarProps {
  search: string
  onSearchChange: (value: string) => void

  examinationSessionFilter: string
  onExaminationSessionFilterChange: (value: string) => void

  statusFilter: string
  onStatusFilterChange: (value: string) => void

  loading: boolean
  onRefresh: () => void
}

const APPLICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: '0', label: 'Chờ xử lý' },
  { value: '1', label: 'Đã duyệt' },
  { value: '2', label: 'Từ chối' },
  { value: '3', label: 'Đang xử lý' },
  { value: '4', label: 'Hoàn thành' },
]

export default function ManagerApplicationToolbar({
  search,
  onSearchChange,
  examinationSessionFilter,
  onExaminationSessionFilterChange,
  statusFilter,
  onStatusFilterChange,
  loading,
  onRefresh,
}: ManagerApplicationToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search and refresh */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo mã sinh viên, tên sinh viên..."
            className={[
              'w-full rounded-lg border border-border-default',
              'bg-bg-primary py-2.5 pl-10 pr-3 text-sm text-text-primary',
              'placeholder:text-text-tertiary',
              'transition-colors',
              'hover:border-brand-orange',
              'focus:border-brand-orange focus:outline-none focus:ring-2',
              'focus:ring-brand-orange/20',
            ].join(' ')}
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className={[
            'inline-flex shrink-0 items-center justify-center gap-2',
            'rounded-lg border border-border-default px-4 py-2.5',
            'text-sm font-medium text-text-primary transition-colors',
            'hover:border-brand-orange hover:text-brand-orange',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          <FiRefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <ExamSessionSelect
          value={examinationSessionFilter}
          onChange={onExaminationSessionFilterChange}
        />

        <div className="w-full sm:w-64">
          <label
            htmlFor="application-status-filter"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Trạng thái
          </label>

          <select
            id="application-status-filter"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value)
            }
            className={[
              'w-full rounded-lg border border-border-default',
              'bg-bg-primary px-3 py-2.5 text-sm text-text-primary',
              'transition-colors',
              'hover:border-brand-orange',
              'focus:border-brand-orange focus:outline-none focus:ring-2',
              'focus:ring-brand-orange/20',
            ].join(' ')}
          >
            {APPLICATION_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}