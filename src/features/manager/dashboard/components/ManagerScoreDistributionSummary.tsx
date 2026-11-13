
import {
  FiFileText,
  FiCpu,
  FiUserCheck,
} from 'react-icons/fi'

import type { IconType } from 'react-icons'

interface ManagerScoreDistributionSummaryProps {
  totalOfficialSubmissions: number
  totalAiGradedSubmissions: number
  totalHumanOfficialSubmissions: number
}

interface SummaryCardProps {
  label: string
  value: number
  icon: IconType
  iconClassName: string
}

function ManagerSummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: SummaryCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border-default bg-bg-primary p-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">
          {label}
        </p>

        <p className="mt-2 text-2xl font-semibold text-text-primary">
          {value.toLocaleString('vi-VN')}
        </p>
      </div>

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  )
}

export default function ManagerScoreDistributionSummary({
  totalOfficialSubmissions,
  totalAiGradedSubmissions,
  totalHumanOfficialSubmissions,
}: ManagerScoreDistributionSummaryProps) {
  const cards: SummaryCardProps[] = [
    {
      label: 'Tổng bài thi chính thức',
      value: totalOfficialSubmissions,
      icon: FiFileText,
      iconClassName: 'bg-brand-orange/10 text-brand-orange',
    },
    {
      label: 'Bài được AI chấm',
      value: totalAiGradedSubmissions,
      icon: FiCpu,
      iconClassName: 'bg-success/10 text-success',
    },
    {
      label: 'Bài được giảng viên chấm',
      value: totalHumanOfficialSubmissions,
      icon: FiUserCheck,
      iconClassName: 'bg-brand-wine/10 text-brand-wine',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <ManagerSummaryCard
          key={card.label}
          {...card}
        />
      ))}
    </div>
  )
}
