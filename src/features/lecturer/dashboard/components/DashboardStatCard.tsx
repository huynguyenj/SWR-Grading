import type { IconType } from 'react-icons'

interface DashboardStatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: IconType
  /** Màu nền + màu chữ của ô icon, VD: 'bg-success/10 text-success' */
  iconClassName?: string
}

export default function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  iconClassName = 'bg-brand-orange/10 text-brand-orange',
}: DashboardStatCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border-default bg-bg-primary p-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-text-primary">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-text-muted">{hint}</p>}
      </div>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${iconClassName}`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
    </div>
  )
}