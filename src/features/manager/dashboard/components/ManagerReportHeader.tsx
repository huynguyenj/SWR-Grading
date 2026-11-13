import { FiRefreshCw } from 'react-icons/fi'

interface ManagerReportHeaderProps {
  loading: boolean
  onRefresh: () => void
}

export default function ManagerReportHeader({
  loading,
  onRefresh,
}: ManagerReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Báo cáo hiệu suất Monitor
        </h1>

        <p className="mt-1 max-w-2xl text-sm text-text-secondary">
          Theo dõi khối lượng công việc, tiến độ chấm điểm và
          hiệu suất hoàn thành assignment của từng Monitor.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className={[
          'flex h-10 shrink-0 items-center justify-center gap-2',
          'rounded-md border border-border-default',
          'bg-bg-primary px-4 text-sm font-medium text-text-secondary',
          'transition-colors hover:border-brand-orange',
          'hover:text-brand-orange',
          'disabled:cursor-not-allowed disabled:opacity-50',
        ].join(' ')}
      >
        <FiRefreshCw
          className={loading ? 'animate-spin' : ''}
        />

        Làm mới dữ liệu
      </button>
    </div>
  )
}