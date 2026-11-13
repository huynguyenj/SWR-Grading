
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


import ManagerScoreDistributionLegend from './ManagerScoreDistributionLegend'
import type { ManagerScoreDistributionBucketType } from '../types/manager_dashboard'

interface ManagerScoreDistributionChartProps {
  data: ManagerScoreDistributionBucketType[]
}

export default function ManagerScoreDistributionChart({
  data,
}: ManagerScoreDistributionChartProps) {
  const totalSubmissions = data.reduce(
    (sum, item) => sum + item.aiCount + item.humanCount,
    0,
  )

  if (totalSubmissions === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center">
        <p className="text-sm font-medium text-text-primary">
          Chưa có dữ liệu phổ điểm
        </p>

        <p className="mt-1 text-xs text-text-muted">
          Chưa có bài thi được chấm trong phạm vi đã chọn.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 12,
              right: 12,
              left: -16,
              bottom: 0,
            }}
            barGap={6}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border-default)"
            />

            <XAxis
              dataKey="label"
              tick={{
                fill: 'var(--color-text-muted)',
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fill: 'var(--color-text-muted)',
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: 'rgba(218, 52, 0, 0.06)',
              }}
              formatter={(value, name) => [
                `${value ?? 0} bài`,
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
              wrapperStyle={{
                fontSize: 12,
                paddingTop: 12,
              }}
            />

            <Bar
              dataKey="aiCount"
              name="AI chấm"
              fill="#DA3400"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />

            <Bar
              dataKey="humanCount"
              name="Giảng viên chấm"
              fill="#7C253B"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ManagerScoreDistributionLegend data={data} />
    </div>
  )
}
