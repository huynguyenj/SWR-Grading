
import { useMemo, useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import Pagination from '@/components/ui/pagination'
import useGetManagerMonitors from '@/features/manager/monitor/hooks/useGetManagerMonitor'
import UploadMonitorInfoFileModal from '@/features/manager/monitor/components/UploadMonitorInfoFileModal'
import ManagerMonitorTable from '@/features/manager/monitor/components/ManagerMonitorTable'
import ManagerMonitorToolbar from '@/features/manager/monitor/components/ManagerMonitorToolbar'

export default function ManagerMonitorManagement() {
  const {
    managerMonitorDataList,
    loading,

    currentMonitorPage,
    pageMonitorSize,
    setCurrentMonitorPage,
    setPageMonitorSize,

    search,
    setSearch,

    refresh,

  } = useGetManagerMonitors()
  const [isUpload, setIsUpload] = useState(false)
  const monitors = managerMonitorDataList?.items ?? []
  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageMonitorSize(size)
    setCurrentMonitorPage(1)
  }

  // Statistics
  const statistics = useMemo(() => {
    const totalMonitors = managerMonitorDataList?.totalCount ?? 0

    const activeMonitors = monitors.filter(
      (student) => student.isActive,
    ).length

    const inactiveMonitors = monitors.filter(
      (student) => !student.isActive,
    ).length

    return {
      totalMonitors,
      activeMonitors,
      inactiveMonitors,
    }
  }, [managerMonitorDataList?.totalCount, monitors])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className='flex justify-between'>
        <div>
          <div className="flex items-center gap-2">
            <FiUsers className="h-6 w-6 text-brand-orange" />

            <h1 className="text-2xl font-semibold text-text-primary">
              Quản lý giám khảo
            </h1>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            Quản lý danh sách và trạng thái tài khoản giám khảo trong hệ thống.
          </p>
        </div>
          <div className='flex gap-2 justify-end'>
            {/* <SemesterSelect
              value={semesterId}
              onChange={handleSemesterChange}
            />
            <ExaminationSelect
              value={examinationId}
              onChange={handleExaminationChange}
            /> */}
          </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">
            Tổng giám khảo
          </p>

          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {statistics.totalMonitors}
          </p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">
            Đang hoạt động
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {statistics.activeMonitors}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Trong trang hiện tại
          </p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">
            Đã khóa
          </p>

          <p className="mt-2 text-2xl font-semibold text-danger">
            {statistics.inactiveMonitors}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Trong trang hiện tại
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <ManagerMonitorToolbar
        search={search}
        onSearchChange={setSearch}
        onRefresh={refresh}
        loading={loading}
        onUpload={() => setIsUpload(true)}
      />

      {/* Student Table */}
      <ManagerMonitorTable
        monitors={monitors}
        loading={loading}
      />

      {/* Pagination */}
      {managerMonitorDataList && managerMonitorDataList.totalPages > 0 && (
        <Pagination
          currentPage={currentMonitorPage}
          onPageChange={setCurrentMonitorPage}
          totalPages={managerMonitorDataList.totalPages}
          pageSize={pageMonitorSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <UploadMonitorInfoFileModal
          open={isUpload}
          onClose={() => setIsUpload(false)}
          onRefresh={refresh}
      />
    </div>
  )
}
