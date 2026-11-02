import type { IconType } from 'react-icons'

interface AdminDashboardStatCardProps {
  label: string
  value: string | number
  hint?: string
  icon: IconType
}

export default function AdminDashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
}: AdminDashboardStatCardProps) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-primary p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-text-secondary">{label}</p>

          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {value}
          </p>

          {hint && (
            <p className="mt-1 text-xs text-text-muted">{hint}</p>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-muted">
          <Icon className="h-5 w-5 text-brand-orange" />
        </div>
      </div>
    </div>
  )
}