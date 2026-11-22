
import {
  FiBookOpen,
  FiCalendar,
  FiMail,
  FiUser,
} from 'react-icons/fi'

import { formatDate } from '@/utils/format'
import type { ManagerMonitor } from '../types/manager_monitor'
import Loading_Circle from '@/components/ui/loading_circle'

interface ManagerMonitorTableProps {
  monitors?: ManagerMonitor[]
  loading: boolean
}

export default function ManagerMonitorTable({
  monitors = [],
  loading,
}: ManagerMonitorTableProps) {
  // Loading state
  if (loading && monitors.length === 0) {
    return <Loading_Circle/>
  }

  // Empty state
  if (monitors.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary px-4 text-center">
        <FiUser className="mb-3 h-10 w-10 text-text-muted" />

        <h3 className="font-medium text-text-primary">
          Không tìm thấy giám khảo
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          Không có giám khảo phù hợp với điều kiện tìm kiếm hiện tại.
        </p>
      </div>
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-bg-primary/40 pt-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
        </div>
      )}

      <table className="w-full min-w-[1050px] text-left text-sm">
        <thead className="bg-bg-muted/50 text-xs uppercase text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Giám khảo</th>
            <th className="px-4 py-3 font-medium">Mã nhân viên</th>
            <th className="px-4 py-3 font-medium">Ngày sinh</th>
            <th className="px-4 py-3 font-medium">Tổng số lần phân công</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium">Ngày tạo</th>
          </tr>
        </thead>

        <tbody>
          {monitors.map((monitor, index) => (
            <tr
              key={monitor.id}
              className="border-b border-border-default transition-colors last:border-b-0 hover:bg-bg-muted/40"
            >
              {/* Index */}
              <td className="px-4 py-3 text-text-muted">
                {index + 1}
              </td>

              {/* Monitor information */}
              <td className="px-4 py-3">
                <div className="flex min-w-52 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <FiUser className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {monitor.fullName}
                    </p>

                    <p className="flex items-center gap-1 truncate text-xs text-text-secondary">
                      <FiMail className="h-3 w-3 shrink-0" />
                      {monitor.email}
                    </p>
                  </div>
                </div>
              </td>

              {/* Monitor code */}
              <td className="px-4 py-3 font-medium text-text-primary">
                {monitor.staffCode}
              </td>

              {/* Birthday */}
              <td className="px-4 py-3 text-text-secondary">
                <span className="flex items-center gap-2">
                  <FiCalendar className="h-3.5 w-3.5" />
                  {formatDate(monitor.birthday)}
                </span>
              </td>

              {/* Assignment count*/}
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-text-secondary">
                  <FiBookOpen className="h-3.5 w-3.5 shrink-0" />
                  {monitor.assignedCount}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                  <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                        monitor.isActive
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-danger/10 text-danger'
                        }`}
                  >
                        <span
                        className={`h-1.5 w-1.5 rounded-full ${
                              monitor.isActive ? 'bg-emerald-500' : 'bg-danger'
                        }`}
                        />

                        {monitor.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
              </td>

              {/* Created date */}
              <td className="px-4 py-3 text-text-secondary">
                {formatDate(monitor.createdDay)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
