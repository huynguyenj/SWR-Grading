
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface ManagerAiHumanAgreementChartProps {
  aiHigherCount: number
  humanHigherCount: number
  equalCount: number
  bothGradedCount: number
}

const AGREEMENT_ITEMS = [
  {
    key: 'ai',
    name: 'AI chấm cao hơn',
    color: '#DA3400',
  },
  {
    key: 'human',
    name: 'Giảng viên chấm cao hơn',
    color: '#7C253B',
  },
  {
    key: 'equal',
    name: 'Hai bên chấm bằng nhau',
    color: '#16A34A',
  },
]

export default function ManagerAiHumanAgreementChart({
  aiHigherCount,
  humanHigherCount,
  equalCount,
  bothGradedCount,
}: ManagerAiHumanAgreementChartProps) {
  const data = [
    { ...AGREEMENT_ITEMS[0], value: aiHigherCount },
    { ...AGREEMENT_ITEMS[1], value: humanHigherCount },
    { ...AGREEMENT_ITEMS[2], value: equalCount },
  ]

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0,
  )

  return (
    <div>
      <div className="relative h-[220px]">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell
                    key={item.key}
                    fill={item.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${value ?? 0} bài`,
                  'Số lượng',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-text-muted">
              Chưa có dữ liệu so sánh.
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-text-primary">
            {bothGradedCount}
          </span>

          <span className="text-xs text-text-muted">
            Bài cùng được chấm
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {data.map((item) => {
          const percentage =
            total > 0
              ? (item.value / total) * 100
              : 0

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="truncate text-xs text-text-secondary">
                  {item.name}
                </span>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-sm font-semibold text-text-primary">
                  {item.value}
                </span>

                <span className="ml-1 text-xs text-text-muted">
                  ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
