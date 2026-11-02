import type { LecturerPerformance } from "../types/admin_dashboard.type"

interface LecturerPerformanceTableProps {
  data: LecturerPerformance[]
}

function formatScore(score: number | null): string {
  return score == null ? '—' : score.toFixed(1)
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export default function LecturerPerformanceTable({
  data,
}: LecturerPerformanceTableProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary px-5 py-12 text-center">
        <p className="text-sm font-medium text-text-primary">
          Chưa có dữ liệu giảng viên
        </p>

        <p className="mt-1 text-sm text-text-muted">
          Học kỳ này chưa có dữ liệu hiệu suất để thống kê.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-primary">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <thead className="bg-bg-surface">
            <tr className="border-b border-border-default">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Giảng viên
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Môn học
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Phiên chấm
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Tổng bài
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Đã chấm
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Chưa chấm
              </th>

              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Hoàn thành
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Điểm TB
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((lecturer) => (
              <tr
                key={lecturer.lecturerId}
                className="border-b border-border-default last:border-b-0 hover:bg-bg-surface"
              >
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-text-primary">
                    {lecturer.fullName}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    {lecturer.lecturerCode}
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    {lecturer.email}
                  </p>
                </td>

                <td className="px-4 py-4 text-sm text-text-primary">
                  {lecturer.subject}
                </td>

                <td className="px-4 py-4 text-right text-sm text-text-primary">
                  {lecturer.totalDiaries}
                </td>

                <td className="px-4 py-4 text-right text-sm text-text-primary">
                  {lecturer.totalSubmissions}
                </td>

                <td className="px-4 py-4 text-right text-sm font-medium text-success">
                  {lecturer.gradedSubmissions}
                </td>

                <td className="px-4 py-4 text-right text-sm text-text-primary">
                  {lecturer.ungradedSubmissions}
                </td>

                <td className="px-4 py-4">
                  <div className="flex min-w-28 items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-muted">
                      <div
                        className="h-full rounded-full bg-brand-orange transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, lecturer.completionRate),
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="w-12 text-right text-xs text-text-secondary">
                      {formatPercentage(lecturer.completionRate)}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-right text-sm font-semibold text-text-primary">
                  {formatScore(lecturer.averageScore)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}