
import { useState } from 'react'
import {
  FiAlertCircle,
  FiFileText,
  FiRefreshCw,
} from 'react-icons/fi'
import SemesterSelect from '@/features/admin/management/semester/components/SemesterSelect'
import useGetManagerScoreDistribution from '@/features/manager/dashboard/hooks/useGetScoreDistributedManager'
import useGetManagerAiHumanStatistics from '@/features/manager/dashboard/hooks/useGetManagerAiHumanStatistics'
import ExaminationSelect from '@/features/manager/dashboard/components/ExaminationSelect'
import ManagerScoreDistributionSummary from '@/features/manager/dashboard/components/ManagerScoreDistributionSummary'
import ManagerScoreDistributionChart from '@/features/manager/dashboard/components/ManagerScoreDistributionChart'
import ManagerAiHumanStatisticsSection from '@/features/manager/dashboard/components/ManagerAiHumanStatisticsSection'

export default function ManagerDashboard() {
  const [semesterId, setSemesterId] = useState('all')
  const [examinationId, setExaminationId] = useState('')
  const selectedSemesterId = semesterId === 'all' ? null : semesterId
  const selectedExaminationId = examinationId || null

  const {
    scoreDistribution,
    loading: scoreLoading,
    error: scoreError,
    refresh: refreshScoreDistribution,
  } = useGetManagerScoreDistribution({
    semesterId: selectedSemesterId,
    examinationId: selectedExaminationId,
  })

  const {
    statistics,
    loading: statisticsLoading,
    error: statisticsError,
    refresh: refreshStatistics,
  } = useGetManagerAiHumanStatistics({
    semesterId: selectedSemesterId,
    examinationId: selectedExaminationId,
  })

  const handleSemesterChange = (newSemesterId: string) => {
    setSemesterId(newSemesterId)
    // Reset examination when semester changes
    setExaminationId('')
  }

  const handleRefreshAll = () => {
    refreshScoreDistribution()
    refreshStatistics()
  }

  const isLoading = scoreLoading || statisticsLoading

  const hasError = Boolean(scoreError || statisticsError)

  const hasData = Boolean(scoreDistribution || statistics)

  return (
    <div className="space-y-6">
      {/*Header*/}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Tổng quan báo cáo
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            Theo dõi phân bố điểm, tiến độ chấm bài và đánh giá
            mức độ tương đồng giữa kết quả chấm của AI và giảng viên.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {/* Semester filter */}
          <SemesterSelect
            value={semesterId}
            onChange={handleSemesterChange}
          />

          {/* Examination filter */}
          <ExaminationSelect
            value={examinationId}
            onChange={setExaminationId}
          />

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isLoading}
            title="Làm mới báo cáo"
            className={[
              'flex h-10 shrink-0 items-center justify-center gap-2',
              'rounded-md border border-border-default',
              'bg-bg-primary px-3 text-sm font-medium text-text-secondary',
              'transition-colors hover:border-brand-orange',
              'hover:text-brand-orange',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            <FiRefreshCw
              className={isLoading ? 'animate-spin' : ''}
            />

            <span className="sm:hidden">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Filter */}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted">
          Phạm vi báo cáo:
        </span>

        <span className="rounded-md bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
          {semesterId === 'all'
            ? 'Tất cả học kỳ'
            : 'Học kỳ đã chọn'}
        </span>

        <span className="rounded-md bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
          {examinationId
            ? 'Kỳ thi đã chọn'
            : 'Tất cả kỳ thi'}
        </span>
      </div>

      {/* Global loading*/}

      {hasError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 shrink-0 text-danger" />

            <div>
              <p className="text-sm font-medium text-danger">
                Không thể tải đầy đủ dữ liệu báo cáo
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                {[
                  scoreError
                    ? `Phổ điểm: ${scoreError}`
                    : null,
                  statisticsError
                    ? `Thống kê AI: ${statisticsError}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(' | ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="shrink-0 text-sm font-medium text-danger hover:underline disabled:opacity-50"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Initial loading */}

      {isLoading && !hasData && (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary">
          <FiRefreshCw className="h-6 w-6 animate-spin text-brand-orange" />

          <p className="mt-3 text-sm font-medium text-text-primary">
            Đang tải dữ liệu báo cáo...
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Vui lòng đợi trong giây lát.
          </p>
        </div>
      )}

      {/* Content */}

      {hasData && (
        <div
          className={[
            'space-y-6 transition-opacity duration-200',
            isLoading ? 'opacity-60' : 'opacity-100',
          ].join(' ')}
        >
          {/* Section 1: Score distribution */}

          <section className="space-y-4">
            {/* Section header */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-orange/10">
                <FiFileText className="h-[18px] w-[18px] text-brand-orange" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-text-primary">
                  Phân bố điểm
                </h2>

                <p className="text-xs text-text-muted">
                  Thống kê phân bố điểm bài thi theo hình thức chấm.
                </p>
              </div>
            </div>

            {scoreDistribution ? (
              <div className="space-y-4">
                {/* Summary cards */}
                <ManagerScoreDistributionSummary
                  totalOfficialSubmissions={
                    scoreDistribution.totalOfficialSubmissions
                  }
                  totalAiGradedSubmissions={
                    scoreDistribution.totalAiGradedSubmissions
                  }
                  totalHumanOfficialSubmissions={
                    scoreDistribution.totalHumanOfficialSubmissions
                  }
                />

                {/* Distribution chart */}
                <div className="rounded-lg border border-border-default bg-bg-primary p-5">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      Phổ điểm theo hình thức chấm
                    </h3>

                    <p className="mt-1 text-xs text-text-muted">
                      So sánh số lượng và tỷ lệ bài thi theo từng
                      khoảng điểm giữa AI và giảng viên.
                    </p>
                  </div>

                  <div className="mt-5">
                    <ManagerScoreDistributionChart
                      data={scoreDistribution.buckets}
                    />
                  </div>
                </div>
              </div>
            ) : scoreLoading ? (
              <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-border-default bg-bg-primary">
                <p className="text-sm text-text-muted">
                  Đang tải báo cáo phổ điểm...
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border-default bg-bg-primary px-5 py-12 text-center">
                <p className="text-sm text-text-muted">
                  Chưa có dữ liệu phân bố điểm.
                </p>
              </div>
            )}
          </section>

          {/* SECTION 2: AI VS HUMAN STATISTICS */}

          <section className="space-y-4">
            {statistics ? (
              <ManagerAiHumanStatisticsSection
                data={statistics}
              />
            ) : statisticsLoading ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border-default bg-bg-primary">
                <p className="text-sm text-text-muted">
                  Đang tải thống kê so sánh AI và giảng viên...
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border-default bg-bg-primary px-5 py-12 text-center">
                <p className="text-sm text-text-muted">
                  Chưa có dữ liệu so sánh AI và giảng viên.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Empty */}

      {!isLoading && !hasData && !hasError && (
        <div className="rounded-lg border border-border-default bg-bg-primary px-5 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-muted">
            <FiFileText className="h-5 w-5 text-text-muted" />
          </div>

          <p className="mt-3 text-sm font-medium text-text-primary">
            Chưa có dữ liệu báo cáo
          </p>

          <p className="mt-1 text-sm text-text-muted">
            Không tìm thấy dữ liệu thống kê phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}
    </div>
  )
}
