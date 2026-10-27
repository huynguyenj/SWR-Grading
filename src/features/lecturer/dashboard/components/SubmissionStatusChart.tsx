import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { GradingProgressItem } from '../types/dashboard.type'

interface SubmissionStatusChartProps {
  data: GradingProgressItem[]
}

export default function SubmissionStatusChart({
  data,
}: SubmissionStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div>
      <div className="relative h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="statusName"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={total > 0 ? 2 : 0}
              stroke="none"
            >
              {data.map((item) => (
                <Cell
                  key={item.statusKey}
                  fill={item.colorHex}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value ?? 0} bài`, 'Số bài']}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-text-primary">
            {total}
          </span>
          <span className="text-xs text-text-muted">bài nộp</span>
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {data.map((item) => (
          <li
            key={item.statusKey}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2 text-text-secondary">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.colorHex }}
              />

              <span className="truncate">{item.statusName}</span>
            </span>

            <span className="shrink-0 text-right">
              <span className="font-medium text-text-primary">
                {item.count}
              </span>
              <span className="ml-1 text-xs text-text-muted">
                ({item.percentage}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}