import { FiUsers } from 'react-icons/fi'
import type { ManagerMonitorPerformanceType } from '../types/manager_monitor_performance'


interface ManagerReportTableProps {
  monitors: ManagerMonitorPerformanceType[]
  totalCount: number
}

function formatScore(
  score: number | null | undefined,
): string {
  return score == null ? '—' : score.toFixed(2)
}

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

function getProgressWidth(value: number): string {
  return `${Math.min(Math.max(value, 0), 100)}%`
}

export default function ManagerReportTable({
  monitors,
  totalCount,
}: ManagerReportTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-primary">
      {/* Table header */}
      <div className="flex flex-col gap-2 border-b border-border-default p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Chi tiết hiệu suất Monitor
          </h2>

          <p className="mt-1 text-xs text-text-muted">
            Thống kê khối lượng công việc và tiến độ của từng Monitor.
          </p>
        </div>

        <span className="text-xs text-text-muted">
          {totalCount} Monitor
        </span>
      </div>

      {/* Empty state */}
      {monitors.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-muted">
            <FiUsers className="h-5 w-5 text-text-muted" />
          </div>

          <p className="mt-3 text-sm font-medium text-text-primary">
            Không tìm thấy Monitor
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Không có dữ liệu phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      ) : (
        /* Monitor table */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-bg-muted/60">
              <tr className="text-xs font-medium text-text-secondary">
                <th className="px-5 py-3">Monitor</th>

                <th className="px-4 py-3 text-center">
                  Tổng bài
                </th>

                <th className="px-4 py-3 text-center">
                  Hoàn thành
                </th>

                <th className="px-4 py-3 text-center">
                  Đang làm
                </th>

                <th className="px-4 py-3 text-center">
                  Quá hạn
                </th>

                <th className="px-4 py-3">
                  Tỷ lệ hoàn thành
                </th>

                <th className="px-5 py-3 text-center">
                  Điểm trung bình
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-default">
              {monitors.map((monitor) => (
                <tr
                  key={monitor.monitorId}
                  className="transition-colors hover:bg-bg-muted/40"
                >
                  {/* Monitor information */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-semibold text-brand-orange">
                        {monitor.fullName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {monitor.fullName}
                        </p>

                        <p className="mt-0.5 text-xs text-text-muted">
                          {monitor.staffCode} · {monitor.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Assigned */}
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-medium text-text-primary">
                      {monitor.assignedCount}
                    </span>
                  </td>

                  {/* Completed */}
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-medium text-success">
                      {monitor.completedCount}
                    </span>
                  </td>

                  {/* In progress */}
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-medium text-text-secondary">
                      {monitor.inProgressCount}
                    </span>
                  </td>

                  {/* Overdue */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={[
                        'text-sm font-medium',
                        monitor.overdueCount > 0
                          ? 'text-danger'
                          : 'text-text-muted',
                      ].join(' ')}
                    >
                      {monitor.overdueCount}
                    </span>
                  </td>

                  {/* Completion rate */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-muted">
                        <div
                          className="h-full rounded-full bg-success"
                          style={{
                            width: getProgressWidth(
                              monitor.completionRate,
                            ),
                          }}
                        />
                      </div>

                      <span className="whitespace-nowrap text-xs font-medium text-text-primary">
                        {formatPercentage(monitor.completionRate)}
                      </span>
                    </div>
                  </td>

                  {/* Average score */}
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-semibold text-text-primary">
                      {formatScore(monitor.averageGivenScore)}
                    </span>

                    <span className="ml-1 text-xs text-text-muted">
                      / 10
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}