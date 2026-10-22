import { useState } from 'react'
import {
  FiArrowDown,
  FiArrowUp,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiFileText,
} from 'react-icons/fi'
import useGetSemester from '@/features/admin/management/semester/hooks/useGetSemester'
import useGetLecturerDashboard from '@/features/lecturer/dashboard/hooks/useGetDashboard'
import DashboardStatCard from '@/features/lecturer/dashboard/components/DashboardStatCard'
import ChartCard from '@/features/lecturer/dashboard/components/ChartCard'
import ScoreDistributionChart from '@/features/lecturer/dashboard/components/ScoreDistributeChart'
import SubmissionStatusChart from '@/features/lecturer/dashboard/components/SubmissionStatusChart'
import SemesterSubmissionChart from '@/features/lecturer/dashboard/components/SemesterSubmissionChart'

function formatScore(score: number | null | undefined) {
  return score === null || score === undefined ? '—' : score.toFixed(1)
}

export default function LecturerMainPage() {
  const [semesterId, setSemesterId] = useState('all')
  const { semesterDataList } = useGetSemester()
  const { dashboard, loading } = useGetLecturerDashboard({ semesterId })

  const total = dashboard?.totalSubmissions ?? 0
  const graded = dashboard?.gradedSubmissions ?? 0
  const gradedPercent = total > 0 ? Math.round((graded / total) * 100) : 0

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Tổng quan chấm điểm</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Theo dõi số lượng bài chấm và phổ điểm theo từng học kỳ.
          </p>
        </div>

        <select
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          className="rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
        >
          <option value="all">Tất cả học kỳ</option>
          {semesterDataList?.items.map((s) => (
            <option key={s.semesterId} value={s.semesterId}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {!dashboard ? (
        <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
          <p className="text-sm text-text-muted">Đang tải dữ liệu thống kê...</p>
        </div>
      ) : (
        <div className={loading ? 'space-y-5 opacity-60 transition-opacity' : 'space-y-5'}>
          {/* Thẻ thống kê */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            <DashboardStatCard
              label="Tổng bài nộp"
              value={total}
              icon={FiFileText}
            />
            <DashboardStatCard
              label="Đã chấm"
              value={graded}
              hint={`${gradedPercent}% tổng bài`}
              icon={FiCheckCircle}
              iconClassName="bg-success/10 text-success"
            />
            <DashboardStatCard
              label="Chưa chấm"
              value={dashboard.pendingSubmissions}
              icon={FiClock}
              iconClassName="bg-bg-muted text-text-secondary"
            />
            <DashboardStatCard
              label="Điểm trung bình"
              value={formatScore(dashboard.averageScore)}
              icon={FiBarChart2}
            />
            <DashboardStatCard
              label="Điểm cao nhất"
              value={formatScore(dashboard.highestScore)}
              icon={FiArrowUp}
              iconClassName="bg-success/10 text-success"
            />
            <DashboardStatCard
              label="Điểm thấp nhất"
              value={formatScore(dashboard.lowestScore)}
              icon={FiArrowDown}
              iconClassName="bg-danger/10 text-danger"
            />
          </div>

          {total === 0 ? (
            <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
              <p className="text-sm text-text-muted">Chưa có bài nộp nào trong phạm vi đã chọn.</p>
            </div>
          ) : (
            <>
              {/* Phổ điểm + trạng thái chấm */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <ChartCard
                  title="Phổ điểm"
                  description="Số bài theo từng khoảng điểm — vùng đỏ là dưới 5 điểm"
                  className="lg:col-span-2"
                >
                  <ScoreDistributionChart data={dashboard.scoreDistribution} />
                </ChartCard>

                <ChartCard title="Tiến độ chấm điểm" description="Phân bổ theo trạng thái bài nộp">
                  <SubmissionStatusChart data={dashboard.statusBreakdown} />
                </ChartCard>
              </div>

              {/* So sánh giữa các học kỳ */}
              <ChartCard
                title="Số bài chấm theo học kỳ"
                description="So sánh tổng bài nộp và số bài đã chấm giữa các học kỳ"
              >
                <SemesterSubmissionChart
                  data={dashboard.submissionsBySemester}
                  selectedSemesterId={semesterId}
                />
              </ChartCard>
            </>
          )}
        </div>
      )}
    </div>
  )
}