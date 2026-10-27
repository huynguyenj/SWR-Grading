import { useState } from 'react'
import {
  FiArrowDown,
  FiArrowUp,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiFileText,
} from 'react-icons/fi'

import useGetLecturerDashboard from '@/features/lecturer/dashboard/hooks/useGetDashboard'
import DashboardStatCard from '@/features/lecturer/dashboard/components/DashboardStatCard'
import ChartCard from '@/features/lecturer/dashboard/components/ChartCard'
import ScoreDistributionChart from '@/features/lecturer/dashboard/components/ScoreDistributeChart'
import SubmissionStatusChart from '@/features/lecturer/dashboard/components/SubmissionStatusChart'
import SemesterSubmissionChart from '@/features/lecturer/dashboard/components/SemesterSubmissionChart'
import SemesterSelect from '@/features/admin/management/semester/components/SemesterSelect'

function formatScore(score: number | null | undefined) {
  return score == null ? '—' : score.toFixed(1)
}

export default function LecturerMainPage() {
  const [semesterId, setSemesterId] = useState('all')

  const { dashboard, loading, error } = useGetLecturerDashboard({
    semesterId,
  })

  const kpi = dashboard?.kpi

  const total = kpi?.totalSubmissions ?? 0
  const graded = kpi?.gradedSubmissions ?? 0
  const gradedPercentage = kpi?.gradedPercentage ?? 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
         <h1 className="text-xl font-semibold text-text-primary">
            Tổng quan chấm điểm
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Theo dõi số lượng bài nộp, tiến độ chấm điểm và phổ điểm theo học kỳ.
          </p>
        </div>

        <SemesterSelect
          value={semesterId}
          onChange={setSemesterId}
        />
      </div>

      {/* Chưa chọn học kỳ */}
      {semesterId == 'all' ? (
        <div className="rounded-lg border border-border-default bg-bg-primary px-5 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-muted">
            <FiFileText className="h-5 w-5 text-text-muted" />
          </div>

          <p className="mt-3 text-sm font-medium text-text-primary">
            Vui lòng chọn học kỳ
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Chọn một học kỳ ở phía trên để xem thống kê bài nộp,
            tiến độ chấm điểm và phổ điểm.
          </p>
        </div>
      ) : (
        <>
          {/* Loading lần đầu */}
          {loading && !dashboard && (
            <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
              <p className="text-sm text-text-muted">
                Đang tải dữ liệu thống kê...
              </p>
            </div>
          )}

          {/* Lỗi khi không có dữ liệu */}
          {error && !dashboard && !loading && (
            <div
              role="alert"
              className="rounded-lg border border-border-default bg-bg-primary px-5 py-12 text-center"
            >
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Dashboard */}
          {dashboard && (
            <div
              className={
                loading
                  ? 'space-y-5 opacity-60 transition-opacity'
                  : 'space-y-5 transition-opacity'
              }
            >
              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
                >
                  {error}
                </div>
              )}

              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
                <DashboardStatCard
                  label="Tổng bài nộp"
                  value={total}
                  icon={FiFileText}
                />

                <DashboardStatCard
                  label="Đã chấm"
                  value={graded}
                  hint={`${gradedPercentage}% tổng bài`}
                  icon={FiCheckCircle}
                  iconClassName="bg-success/10 text-success"
                />

                <DashboardStatCard
                  label="Chưa chấm"
                  value={kpi?.ungradedSubmissions ?? 0}
                  icon={FiClock}
                  iconClassName="bg-bg-muted text-text-secondary"
                />

                <DashboardStatCard
                  label="Điểm trung bình"
                  value={formatScore(kpi?.averageScore)}
                  icon={FiBarChart2}
                />

                <DashboardStatCard
                  label="Điểm cao nhất"
                  value={formatScore(kpi?.highestScore)}
                  icon={FiArrowUp}
                  iconClassName="bg-success/10 text-success"
                />

                <DashboardStatCard
                  label="Điểm thấp nhất"
                  value={formatScore(kpi?.lowestScore)}
                  icon={FiArrowDown}
                  iconClassName="bg-danger/10 text-danger"
                />
              </div>
                {/* Empty state */}
                {total === 0 ? (
                  <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-muted">
                      <FiFileText className="h-5 w-5 text-text-muted" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-text-primary">
                      Chưa có bài nộp nào
                    </p>

                    <p className="mt-1 text-sm text-text-muted">
                      Không có dữ liệu thống kê trong học kỳ đã chọn.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Phổ điểm và tiến độ chấm */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <ChartCard
                        title="Phổ điểm"
                        description="Phân bố số bài theo từng khoảng điểm. Vùng đỏ biểu thị mức điểm dưới ngưỡng đạt."
                        className="lg:col-span-2"
                      >
                        <ScoreDistributionChart
                          data={dashboard.scoreDistribution}
                        />
                      </ChartCard>

                      <ChartCard
                        title="Tiến độ chấm điểm"
                        description="Phân bổ bài nộp theo trạng thái chấm."
                      >
                        <SubmissionStatusChart
                          data={dashboard.gradingProgress}
                        />
                      </ChartCard>
                    </div>

                    {/* So sánh học kỳ */}
                    <ChartCard
                      title="Số bài nộp theo học kỳ"
                      description="So sánh tổng số bài nộp và số bài đã chấm giữa các học kỳ."
                    >
                      <SemesterSubmissionChart
                        data={dashboard.semesterComparison}
                        selectedSemesterId={semesterId}
                      />
                    </ChartCard>
                  </>
                )}
            </div>
          )}
        </>
      )}
    </div>
  )
}