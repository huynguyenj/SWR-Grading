
import { FiFilter, FiRefreshCw, FiSearch } from 'react-icons/fi'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import type { UserRole } from '../types/admin_user'

interface AdminUsersToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  role: UserRole | undefined
  onRoleChange: (value: UserRole | undefined) => void
  onRefresh: () => void
  loading?: boolean
}

const roleOptions: {
  value: UserRole | 'all'
  label: string
}[] = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 0, label: 'Học sinh' },
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Giám khảo' },
  { value: 3, label: 'Khảo thí' },
  { value: 4, label: 'Quản lý bộ môn' },
]

export default function AdminUsersToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  onRefresh,
  loading = false,
}: AdminUsersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên, email hoặc mã nhân viên..."
            icon={FiSearch}
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <FiFilter className="h-4 w-4 text-text-secondary" />

          <select
            value={role ?? 'all'}
            onChange={(e) => {
              const value = e.target.value
              onRoleChange(
                value === 'all' ? undefined : Number(value) as UserRole,
              )
            }}
            className="rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="basic"
          variant="basic"
          onClick={onRefresh}
          disabled={loading}
        >
          <FiRefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </Button>
      </div>
    </div>
  )
}
