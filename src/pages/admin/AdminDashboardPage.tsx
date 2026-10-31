
import {
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi'

import AdminDashboardStatCard from '@/features/admin/data/components/AdminDashboardStatCard'
import AdminScoreDistributionChart from '@/features/admin/data/components/AdminScoreDistributionChart'
import useGetSemesterStatistics from '@/features/admin/data/hooks/useGetSemesterStatistics'

import { formatPercentage, formatScore } from '@/utils/format'

function getSemesterStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Đang diễn ra'
    case 'upcoming':
      return 'Sắp diễn ra'
    case 'completed':
      return 'Đã kết thúc'
    default:
      return status
  }
}

function getSemesterStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-success/10 text-success'
    case 'upcoming':
      return 'bg-warning/10 text-warning'
    case 'completed':
      return 'bg-bg-muted text-text-secondary'
    default:
      return 'bg-bg-muted text-text-secondary'
  }
}

export default function AdminDashboardPage() {
  const {
    semesters,
    loading,
    error,
    refresh,
  } = useGetSemesterStatistics()

  // =========================================================
  // LOADING
  // =========================================================

  if (loading && semesters.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-text-secondary">
          Đang tải dữ liệu thống kê...
        </p>
      </div>
    )
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && semesters.length === 0) {
    return (
      <div className="rounded-lg border border-danger/30 bg-danger/5 p-6 text-center">
        <p className="text-sm text-danger">
          Không thể tải dữ liệu thống kê: {error}
        </p>

        <button
          type="button"
          onClick={refresh}
          className="mt-3 text-sm font-medium text-brand-orange hover:underline"
        >
          Thử lại
        </button>
      </div>
    )
  }

  // =========================================================
  // EMPTY DATA
  // =========================================================

  if (semesters.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center">
        <FiBookOpen className="mx-auto h-8 w-8 text-text-muted" />

        <p className="mt-3 font-medium text-text-primary">
          Chưa có dữ liệu thống kê
        </p>

        <p className="mt-1 text-sm text-text-secondary">
          Hệ thống chưa có dữ liệu học kỳ để hiển thị.
        </p>

        <button
          type="button"
          onClick={refresh}
          className="mt-4 text-sm font-medium text-brand-orange hover:underline"
        >
          Tải lại dữ liệu
        </button>
      </div>
    )
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Tổng quan hệ thống
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Theo dõi tình hình kỳ thi, kết quả chấm điểm và phổ điểm của các học kỳ.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-text-on-brand transition-colors hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
        </button>
      </div>

      {/* ERROR WHEN REFRESHING */}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          Không thể cập nhật dữ liệu mới: {error}
        </div>
      )}

      {/* =================================================== */}
      {/* SEMESTER STATISTICS */}
      {/* =================================================== */}

      {semesters.map((semester) => (
        <section
          key={semester.semesterId}
          className="space-y-4 rounded-lg border border-border-default bg-bg-primary p-4 sm:p-5"
        >
          {/* SEMESTER HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">
                  {semester.semesterCode}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getSemesterStatusClass(
                    semester.status,
                  )}`}
                >
                  {getSemesterStatusLabel(semester.status)}
                </span>
              </div>

              <p className="mt-1 text-sm text-text-secondary">
                {semester.semesterName}
              </p>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AdminDashboardStatCard
              label="Tổng kỳ thi"
              value={semester.totalExaminations}
              icon={FiBookOpen}
            />

            <AdminDashboardStatCard
              label="Tổng bài nộp"
              value={semester.totalSubmissions}
              icon={FiFileText}
            />

            <AdminDashboardStatCard
              label="Bài đã chấm"
              value={semester.gradedSubmissions}
              hint={`${formatPercentage(semester.gradedPercentage)} tổng bài nộp`}
              icon={FiCheckCircle}
            />

            <AdminDashboardStatCard
              label="Bài chưa chấm"
              value={semester.ungradedSubmissions}
              icon={FiClock}
            />

            <AdminDashboardStatCard
              label="Điểm trung bình"
              value={formatScore(semester.averageScore)}
              icon={FiBarChart2}
            />

            <AdminDashboardStatCard
              label="Điểm cao nhất"
              value={formatScore(semester.highestScore)}
              icon={FiTrendingUp}
            />

            <AdminDashboardStatCard
              label="Tỷ lệ đạt"
              value={formatPercentage(semester.passRate)}
              icon={FiActivity}
            />

            <AdminDashboardStatCard
              label="Tỷ lệ không đạt"
              value={formatPercentage(semester.failRate)}
              icon={FiUsers}
            />
          </div>

          {/* SCORE DISTRIBUTION */}
          <div className="border-t border-border-default pt-4">
            <h3 className="mb-4 font-semibold text-text-primary">
              Phổ điểm
            </h3>

            {semester.totalSubmissions === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <FiBarChart2 className="h-8 w-8 text-text-muted" />

                <p className="mt-3 text-sm font-medium text-text-primary">
                  Chưa có bài nộp
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  Chưa có dữ liệu để hiển thị phổ điểm.
                </p>
              </div>
            ) : (
              <AdminScoreDistributionChart
                data={semester.scoreDistribution}
              />
            )}
          </div>

          {/* SEMESTER SUMMARY */}
          <div className="grid grid-cols-3 gap-3 border-t border-border-default pt-4">
            <div>
              <p className="text-xs text-text-muted">
                Tổng bài nộp
              </p>

              <p className="mt-1 font-semibold text-text-primary">
                {semester.totalSubmissions}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-muted">
                Đã chấm
              </p>

              <p className="mt-1 font-semibold text-success">
                {semester.gradedSubmissions}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-muted">
                Chưa chấm
              </p>

              <p className="mt-1 font-semibold text-warning">
                {semester.ungradedSubmissions}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
