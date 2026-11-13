import type { ReactNode } from 'react'
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUsers,
} from 'react-icons/fi'

interface ManagerReportOverviewProps {
  totalMonitors: number
  totalAssignments: number
  completedAssignments: number
  completionRate: number
}

interface KpiCardProps {
  label: string
  value: string | number
  icon: ReactNode
  iconClassName: string
  progress?: number
}

function getProgressWidth(value: number): string {
  return `${Math.min(Math.max(value, 0), 100)}%`
}

function KpiCard({
  label,
  value,
  icon,
  iconClassName,
  progress,
}: KpiCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border-default bg-bg-primary p-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-muted">
          {label}
        </p>

        <p className="mt-1 text-2xl font-semibold text-text-primary">
          {value}
        </p>

        {progress !== undefined && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-muted">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{
                width: getProgressWidth(progress),
              }}
            />
          </div>
        )}
      </div>

      <div
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-md',
          iconClassName,
        ].join(' ')}
      >
        {icon}
      </div>
    </div>
  )
}

export default function ManagerReportOverview({
  totalMonitors,
  totalAssignments,
  completedAssignments,
  completionRate,
}: ManagerReportOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard
        label="Tổng Monitor"
        value={totalMonitors}
        icon={<FiUsers className="h-[18px] w-[18px]" />}
        iconClassName="bg-brand-orange/10 text-brand-orange"
      />

      <KpiCard
        label="Tổng assignment"
        value={totalAssignments}
        icon={<FiFileText className="h-[18px] w-[18px]" />}
        iconClassName="bg-brand-wine/10 text-brand-wine"
      />

      <KpiCard
        label="Đã hoàn thành"
        value={completedAssignments}
        icon={<FiCheckCircle className="h-[18px] w-[18px]" />}
        iconClassName="bg-success/10 text-success"
      />

      <KpiCard
        label="Tỷ lệ hoàn thành"
        value={`${completionRate.toFixed(2)}%`}
        progress={completionRate}
        icon={<FiClock className="h-[18px] w-[18px]" />}
        iconClassName="bg-success/10 text-success"
      />
    </div>
  )
}