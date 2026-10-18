import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { SubmissionStatus } from '@/features/lecturer/grading_exam/types/submission.type'
import type { StatusBreakdownItem } from '../types/dashboard.type'
import { CHART_COLORS } from '../const/chart.theme'

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  '0': 'Đã nộp (chưa chấm)',
  '1': 'AI đã chấm',
  '2': 'GV đã duyệt',
  '3': 'Hoàn tất',
}

const STATUS_COLOR: Record<SubmissionStatus, string> = {
  '0': CHART_COLORS.neutral,
  '1': CHART_COLORS.orange,
  '2': CHART_COLORS.wine,
  '3': CHART_COLORS.success,
}

interface SubmissionStatusChartProps {
  data: StatusBreakdownItem[]
}

export default function SubmissionStatusChart({ data }: SubmissionStatusChartProps) {
  // status từ BE có thể là số hay chuỗi -> chuẩn hóa về chuỗi để tra map
  const items = data.map((d) => {
    const key = String(d.status) as SubmissionStatus
    return { key, label: STATUS_LABEL[key], color: STATUS_COLOR[key], count: d.count }
  })
  const total = items.reduce((sum, i) => sum + i.count, 0)

  return (
    <div>
      <div className="relative h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="count"
              nameKey="label"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={total > 0 ? 2 : 0}
              stroke="none"
            >
              {items.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} bài`, 'Số bài']} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-text-primary">{total}</span>
          <span className="text-xs text-text-muted">bài nộp</span>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-text-secondary">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
            <span className="font-medium text-text-primary">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}