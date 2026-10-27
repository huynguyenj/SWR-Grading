import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { SemesterComparisonItem } from '../types/dashboard.type'
import { axisTick, CHART_COLORS } from '../const/chart.theme'

interface SemesterSubmissionChartProps {
  data: SemesterComparisonItem[]
  selectedSemesterId: string
}

export default function SemesterSubmissionChart({
  data,
  selectedSemesterId,
}: SemesterSubmissionChartProps) {
  const opacityOf = (semesterId: string) =>
    selectedSemesterId === 'all' || selectedSemesterId === semesterId
      ? 1
      : 0.3

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={CHART_COLORS.grid}
          />

          <XAxis
            dataKey="semesterName"
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip cursor={{ fill: 'rgba(218, 52, 0, 0.06)' }} />

          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />

          <Bar
            dataKey="totalSubmissions"
            name="Tổng bài nộp"
            fill={CHART_COLORS.neutral}
            radius={[4, 4, 0, 0]}
          >
            {data.map((item) => (
              <Cell
                key={item.semesterId}
                fillOpacity={opacityOf(item.semesterId)}
              />
            ))}
          </Bar>

          <Bar
            dataKey="gradedSubmissions"
            name="Đã chấm"
            fill={CHART_COLORS.orange}
            radius={[4, 4, 0, 0]}
          >
            {data.map((item) => (
              <Cell
                key={item.semesterId}
                fillOpacity={opacityOf(item.semesterId)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}