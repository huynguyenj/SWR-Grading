import { useState } from 'react'

import Pagination from '@/components/ui/pagination'

import useGetManagerMonitorPerformance from '@/features/manager/dashboard/hooks/useGetManagerMonitorPerformance'
import type { ManagerMonitorPerformanceType } from '@/features/manager/dashboard/types/manager_monitor_performance'
import ManagerReportHeader from '@/features/manager/dashboard/components/ManagerReportHeader'
import ManagerReportFilter from '@/features/manager/dashboard/components/ManagerReportFilter'
import ManagerReportOverview from '@/features/manager/dashboard/components/ManagerReportOverview'
import ManagerReportTable from '@/features/manager/dashboard/components/ManagerReportTable'


export default function ManagerReportPage() {
  // ============================================================
  // 1. FILTER STATE
  // ============================================================

  const [semesterId, setSemesterId] = useState('all')
  const [examinationId, setExaminationId] = useState('')
  const [search, setSearch] = useState('')

  // ============================================================
  // 2. API
  // ============================================================

  const {
    monitorPerformance,
    loading,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    refresh,
  } = useGetManagerMonitorPerformance({
    semesterId: semesterId === 'all' ? null : semesterId,
    examinationId: examinationId || null,
    search,
  })

  const pagedMonitors = monitorPerformance?.pagedMonitors

  const monitors: ManagerMonitorPerformanceType[] =
    pagedMonitors?.items ?? []

  // ============================================================
  // 3. FILTER HANDLERS
  // ============================================================

  const handleSemesterChange = (value: string) => {
    setSemesterId(value)
    setExaminationId('')
    setCurrentPage(1)
  }

  const handleExaminationChange = (value: string) => {
    setExaminationId(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  // ============================================================
  // 4. RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <ManagerReportHeader
        loading={loading}
        onRefresh={refresh}
      />

      {/* Filters */}
      <ManagerReportFilter
        semesterId={semesterId}
        examinationId={examinationId}
        search={search}
        onSemesterChange={handleSemesterChange}
        onExaminationChange={handleExaminationChange}
        onSearchChange={handleSearchChange}
      />

      {/* Initial loading */}
      {loading && !monitorPerformance && (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary">
          <p className="text-sm font-medium text-text-primary">
            Đang tải báo cáo Monitor...
          </p>
        </div>
      )}

      {/* Report content */}
      {monitorPerformance && (
        <div
          className={[
            'space-y-6 transition-opacity duration-200',
            loading ? 'opacity-60' : 'opacity-100',
          ].join(' ')}
        >
          {/* Overview */}
          <ManagerReportOverview
            totalMonitors={monitorPerformance.totalMonitors}
            totalAssignments={monitorPerformance.totalAssignments}
            completedAssignments={
              monitorPerformance.totalCompletedAssignments
            }
            completionRate={monitorPerformance.overallCompletionRate}
          />

          {/* Monitor performance table */}
          <ManagerReportTable
            monitors={monitors}
            totalCount={pagedMonitors?.totalCount ?? 0}
          />

          {/* Pagination */}
          {pagedMonitors && pagedMonitors.totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={pagedMonitors.totalPages}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              pageSize={pageSize}
            />
          )}
        </div>
      )}
    </div>
  )
}