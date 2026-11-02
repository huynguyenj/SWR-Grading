import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ScoreDistributionItem } from '../types/admin_dashboard.type'


interface AdminScoreDistributionChartProps {
  data: ScoreDistributionItem[]
}

export default function AdminScoreDistributionChart({
  data,
}: AdminScoreDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-text-muted">
        Chưa có dữ liệu phổ điểm.
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
        >
          <CartesianGrid
            stroke="var(--color-border-default)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="range"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border-default)' }}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: 'var(--color-bg-muted)', opacity: 0.5 }}
            contentStyle={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
            }}
            formatter={(value) => [value ?? 0, 'Số bài']}
            labelFormatter={(label) => `Khoảng điểm: ${label}`}
          />

          <Bar dataKey="count" name="Số bài" radius={[4, 4, 0, 0]}>
            {data.map((item) => (
              <Cell
                key={item.range}
                fill={
                  item.isBelowPass
                    ? 'var(--color-danger)'
                    : 'var(--brand-orange)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}