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
import type { ScoreBucket } from '../types/dashboard.type'
import { axisTick, CHART_COLORS } from '../const/chart.theme'

interface ScoreDistributionChartProps {
  data: ScoreBucket[]
}

/** Phổ điểm: số bài theo từng khoảng điểm. Khoảng dưới 5 tô đỏ để thấy vùng điểm yếu. */
export default function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis dataKey="range" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(218, 52, 0, 0.06)' }}
            formatter={(value) => [`${value} bài`, 'Số bài']}
            labelFormatter={(label) => `Điểm ${label}`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((bucket) => (
              <Cell
                key={bucket.range}
                fill={bucket.min < 5 ? CHART_COLORS.danger : CHART_COLORS.orange}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}