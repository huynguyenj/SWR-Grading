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
import type { SemesterSubmissionItem } from '../types/dashboard.type'
import { axisTick, CHART_COLORS } from '../const/chart.theme'

interface SemesterSubmissionChartProps {
  data: SemesterSubmissionItem[]
  /** Học kỳ đang lọc ('all' = không lọc) — các học kỳ khác sẽ mờ đi */
  selectedSemesterId: string
}

/** So sánh tổng bài nộp và số bài đã chấm giữa các học kỳ */
export default function SemesterSubmissionChart({
  data,
  selectedSemesterId,
}: SemesterSubmissionChartProps) {
  const opacityOf = (semesterId: string) =>
    selectedSemesterId === 'all' || selectedSemesterId === semesterId ? 1 : 0.3

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis dataKey="semesterName" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(218, 52, 0, 0.06)' }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="total" name="Tổng bài nộp" fill={CHART_COLORS.neutral} radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.semesterId} fillOpacity={opacityOf(d.semesterId)} />
            ))}
          </Bar>
          <Bar dataKey="graded" name="Đã chấm" fill={CHART_COLORS.orange} radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.semesterId} fillOpacity={opacityOf(d.semesterId)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}