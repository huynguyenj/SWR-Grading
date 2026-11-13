
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ManagerAiHumanScoreChartProps {
  humanAverageScore: number | null
  humanHighestScore: number | null
  humanLowestScore: number | null
  aiAverageScore: number | null
  aiHighestScore: number | null
  aiLowestScore: number | null
}

export default function ManagerAiHumanScoreChart({
  humanAverageScore,
  humanHighestScore,
  humanLowestScore,
  aiAverageScore,
  aiHighestScore,
  aiLowestScore,
}: ManagerAiHumanScoreChartProps) {
  const data = [
    {
      metric: 'Điểm trung bình',
      ai: aiAverageScore,
      human: humanAverageScore,
    },
    {
      metric: 'Điểm cao nhất',
      ai: aiHighestScore,
      human: humanHighestScore,
    },
    {
      metric: 'Điểm thấp nhất',
      ai: aiLowestScore,
      human: humanLowestScore,
    },
  ]

  const hasData = data.some(
    (item) => item.ai !== null || item.human !== null,
  )

  if (!hasData) {
    return (
      <div className="flex min-h-[260px] items-center justify-center">
        <p className="text-sm text-text-muted">
          Chưa có dữ liệu để so sánh điểm số.
        </p>
      </div>
    )
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-border-default)"
          />

          <XAxis
            dataKey="metric"
            tick={{
              fill: 'var(--color-text-muted)',
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{
              fill: 'var(--color-text-muted)',
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value, name) => [
              value == null ? 'Chưa có dữ liệu' : `${Number(value).toFixed(2)} điểm`,
              name ?? '',
            ]}
            contentStyle={{
              backgroundColor: 'var(--color-bg-primary)',
              borderColor: 'var(--color-border-default)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />

          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />

          <Bar
            dataKey="ai"
            name="AI"
            fill="#DA3400"
            radius={[4, 4, 0, 0]}
            maxBarSize={38}
          />

          <Bar
            dataKey="human"
            name="Giảng viên"
            fill="#7C253B"
            radius={[4, 4, 0, 0]}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
