import { useEffect, useMemo, useState } from 'react'

import ManagerApplicationToolbar from '@/features/manager/application/components/ManagerApplicationToolbar'
import ManagerApplicationTable from '@/features/manager/application/components/ManagerApplicationTable'
import useGetManagerApplicationList from '@/features/manager/application/hooks/useGetManagerApplicationList'
import Pagination from '@/components/ui/pagination'

import type { ApplicationStatus } from '@/features/student/application/types/application_type'

export default function ManagerApplicationPage() {
  const [search, setSearch] = useState('')

  const [examinationSessionFilter, setExaminationSessionFilter] =
    useState('all')

  const [statusFilter, setStatusFilter] = useState('all')

  // Convert status string to ApplicationStatus
  const status: ApplicationStatus | 'all' =
    statusFilter === 'all'
      ? 'all'
      : (Number(statusFilter) as ApplicationStatus)

  const {
    applicationDataList,
    loading,
    currentApplicationPage,
    pageApplicationSize,
    setCurrentApplicationPage,
    setPageApplicationSize,
    refresh,
  } = useGetManagerApplicationList({
    examinationSessionId: examinationSessionFilter,
    status,
  })

  // Reset pagination when filters or page size change
  useEffect(() => {
    setCurrentApplicationPage(1)
  }, [
    examinationSessionFilter,
    statusFilter,
    pageApplicationSize,
    setCurrentApplicationPage,
  ])

  // Search on current page data
  const filteredApplications = useMemo(() => {
    const applications = applicationDataList?.items ?? []
    const keyword = search.trim().toLowerCase()

    if (!keyword) return applications

    return applications.filter((application) => {
      const searchableValues = [
        application.studentCode,
        application.studentName,
        application.examinationName,
        application.examinationSessionCode,
        application.reason,
      ]

      return searchableValues
        .filter(
          (value): value is string => typeof value === 'string',
        )
        .some((value) => value.toLowerCase().includes(keyword))
    })
  }, [applicationDataList?.items, search])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Quản lý đơn phúc khảo
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Theo dõi và quản lý các đơn phúc khảo của sinh viên.
        </p>
      </div>

      {/* Toolbar */}
      <ManagerApplicationToolbar
        search={search}
        onSearchChange={setSearch}
        examinationSessionFilter={examinationSessionFilter}
        onExaminationSessionFilterChange={setExaminationSessionFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Application Table */}
      <ManagerApplicationTable
        applications={filteredApplications}
        loading={loading}
        onRefresh={refresh}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentApplicationPage}
        pageSize={pageApplicationSize}
        totalPages={applicationDataList?.totalPages ?? 1}
        onPageChange={setCurrentApplicationPage}
        onPageSizeChange={setPageApplicationSize}
      />
    </div>
  )
}