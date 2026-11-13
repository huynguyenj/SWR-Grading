
interface ManagerAiHumanAccuracyCardProps {
  averageScoreDifference: number | null
  meanAbsoluteError: number | null
  acceptableDeviationRate: number
}

interface ManagerAccuracyMetricProps {
  label: string
  value: string
  description: string
  icon: string
}

function ManagerAccuracyMetric({
  label,
  value,
  description,
  icon,
}: ManagerAccuracyMetricProps) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <p className="text-xs font-medium text-text-muted">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-semibold text-text-primary">
        {value}
      </p>

      <p className="mt-1 text-xs text-text-secondary">
        {description}
      </p>
    </div>
  )
}

function formatScore(value: number | null) {
  return value === null ? '—' : value.toFixed(2)
}

export default function ManagerAiHumanAccuracyCard({
  averageScoreDifference,
  meanAbsoluteError,
  acceptableDeviationRate,
}: ManagerAiHumanAccuracyCardProps) {
  const formattedDifference =
    averageScoreDifference === null
      ? '—'
      : `${averageScoreDifference > 0 ? '+' : ''}${averageScoreDifference.toFixed(2)}`

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ManagerAccuracyMetric
        label="Mean Absolute Error"
        value={formatScore(meanAbsoluteError)}
        description="Sai số tuyệt đối trung bình (điểm)"
        icon="📐"
      />

      <ManagerAccuracyMetric
        label="Average Score Difference"
        value={formattedDifference}
        description="Chênh lệch điểm trung bình"
        icon="⚖️"
      />

      <ManagerAccuracyMetric
        label="Acceptable Deviation Rate"
        value={`${acceptableDeviationRate.toFixed(1)}%`}
        description="Tỷ lệ bài đạt ngưỡng sai lệch cho phép"
        icon="🎯"
      />
    </div>
  )
}
