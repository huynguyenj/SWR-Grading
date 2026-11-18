
import { useEffect, useState } from 'react'
import { FiUserPlus, FiPlus, FiTrash2, FiSearch } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Pagination from '@/components/ui/pagination'
import useMultipleAssignment from '../hooks/useMultipleAssignment'
import type { ManagerAvailableMonitor } from '../../monitor/types/manager_monitor'
import useGetAvailableManagerMonitors from '../hooks/useGetAvailableMonitor'

interface AssignGradingModalProps {
  gradingSessionId: string
  isOpen: boolean
  onClose: () => void
  onRefresh: () => void
}

export default function AssignGradingModal({
  gradingSessionId,
  isOpen,
  onClose,
  onRefresh,
}: AssignGradingModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState('')

  // Cache monitor information across pages and searches
  const [selectedMonitorMap, setSelectedMonitorMap] = useState<Record<string, ManagerAvailableMonitor>>({})

  const {
    register,
    handleSubmit,
    errors,
    loading: assigning,
    selectedMonitorIds,
    addMonitor,
    removeMonitor,
    onSubmit,
    reset,
  } = useMultipleAssignment({ gradingSessionId, onRefresh })

  // Get available manager monitors
  const {
    managerMonitorDataList,
    loading: loadingMonitors,

    currentMonitorPage,
    pageMonitorSize,
    setCurrentMonitorPage,
    setPageMonitorSize,

    search,
    setSearch,

    isBusySearch,
    setIsBusySearch,

    refresh: refreshMonitors,
  } = useGetAvailableManagerMonitors()

  // Current page monitor list
  const monitorList = managerMonitorDataList?.items ?? []

  // Cache monitor information
  useEffect(() => {
    if (monitorList.length === 0) return
    const loadMonitorList = () => {
        setSelectedMonitorMap((prev) => {
          const next = { ...prev }
    
          monitorList.forEach((monitor) => {
            next[monitor.id] = monitor
          })
    
          return next
        })
    }
    loadMonitorList()
  }, [monitorList])

  // Resolve selected monitors from cached information
  const selectedMonitors = selectedMonitorIds
    .map((id) => selectedMonitorMap[id])
    .filter(
      (monitor): monitor is ManagerAvailableMonitor =>
        monitor !== undefined,
    )

  // Available monitors on current page
  const availableMonitors = monitorList.filter(
    (monitor) => !selectedMonitorIds.includes(monitor.id),
  )

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentMonitorPage(1)
  }

  // Handle busy filter
  const handleBusyFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsBusySearch(event.target.checked)
    setCurrentMonitorPage(1)
  }

  // Add monitor
  const handleAddMonitor = () => {
    if (!selectedStaffId) return
    addMonitor(selectedStaffId)
    setSelectedStaffId('')
  }

  // Submit assignment
  const handleAssignSubmit = async (formData: Parameters<typeof onSubmit>[0]) => {
    const isSuccess = await onSubmit(formData)
    if (isSuccess) {
      setSelectedStaffId('')
      setSelectedMonitorMap({})
      refreshMonitors()
      onClose()
    }
  }

  // Close modal and reset form
  const handleClose = () => {
    if (assigning) return
    reset()
    setSelectedStaffId('')
    setSelectedMonitorMap({})
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Phân công giảng viên"
      maxWidth="xl"
    >
      <form
        onSubmit={handleSubmit(handleAssignSubmit)}
        className="flex flex-col gap-5 px-4 py-3"
      >
        {/* Description */}
        <p className="text-sm text-text-secondary">
          Chọn giảng viên và số lượng bài nộp cần chấm.
        </p>

        {/* Monitor selection */}
        <div>
          <label
            htmlFor="monitorSearch"
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            Giảng viên
            <span className="ml-1 text-danger">*</span>
          </label>

          {/* Search */}
          <div className="relative mb-3">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />

            <input
              id="monitorSearch"
              type="text"
              value={search}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              placeholder="Tìm theo tên, mã nhân viên..."
              disabled={assigning}
              className="h-10 w-full rounded-md border border-border-default bg-bg-primary pl-9 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Busy filter */}
          <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={isBusySearch}
              onChange={handleBusyFilterChange}
              disabled={assigning}
              className="h-4 w-4 accent-brand-orange"
            />

            Chỉ hiển thị giảng viên đang bận
          </label>

          {/* Monitor dropdown */}
          <div className="flex items-center gap-2">
            <select
              id="staffId"
              value={selectedStaffId}
              onChange={(event) =>
                setSelectedStaffId(event.target.value)
              }
              disabled={
                loadingMonitors ||
                assigning ||
                availableMonitors.length === 0
              }
              className="h-10 min-w-0 flex-1 rounded-md border border-border-default bg-bg-primary px-3 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingMonitors
                  ? 'Đang tải danh sách giảng viên...'
                  : availableMonitors.length === 0
                    ? 'Không có giảng viên phù hợp'
                    : '-- Chọn giảng viên --'}
              </option>

              {availableMonitors.map((monitor) => (
                <option key={monitor.id} value={monitor.id}>
                  {monitor.fullName} - {monitor.staffCode}
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="default"
              size="basic"
              onClick={handleAddMonitor}
              disabled={!selectedStaffId || assigning}
              title="Thêm giảng viên"
            >
              <FiPlus size={18} />
            </Button>
          </div>

          {errors.monitors && (
            <p className="mt-1 text-xs text-danger">
              {errors.monitors.message}
            </p>
          )}

          {/* Pagination */}
          {managerMonitorDataList && (
            <div className="mt-3 flex justify-end">
              <Pagination
                currentPage={currentMonitorPage}
                totalPages={managerMonitorDataList.totalPages}
                pageSize={pageMonitorSize}
                onPageChange={setCurrentMonitorPage}
                onPageSizeChange={setPageMonitorSize}
              />
            </div>
          )}
        </div>

        {/* Selected monitors */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Giảng viên đã chọn
            </label>

            <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange">
              {selectedMonitorIds.length} giảng viên
            </span>
          </div>

          <div className="max-h-56 space-y-2 overflow-y-auto">
            {selectedMonitors.length > 0 ? (
              selectedMonitors.map((monitor) => (
                <div
                  key={monitor.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-surface px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-semibold text-brand-orange">
                      {monitor.fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {monitor.fullName}
                      </p>

                      <p className="text-xs text-text-muted">
                        {monitor.staffCode}
                      </p>

                      <p className="mt-0.5 text-xs text-text-secondary">
                        {monitor.workingStatus} ·{' '}
                        {monitor.inProgressCount} đang chấm ·{' '}
                        {monitor.completedCount} hoàn thành
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="basic"
                    size="basic"
                    className="shrink-0! border-danger/20! text-danger! hover:bg-danger/10!"
                    onClick={() => removeMonitor(monitor.id)}
                    disabled={assigning}
                    title="Xóa giảng viên"
                  >
                    <FiTrash2 size={15} />
                  </Button>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border-default py-8 text-center">
                <FiUserPlus className="mx-auto mb-2 h-7 w-7 text-text-muted" />

                <p className="text-sm text-text-secondary">
                  Chưa có giảng viên nào được chọn
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Chọn giảng viên và nhấn nút + để thêm
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Number of submissions */}
        <div>
          <label
            htmlFor="submissionPerMonitor"
            className="mb-1.5 block text-sm font-medium text-text-primary"
          >
            Số lượng bài nộp cho mỗi giảng viên
            <span className="ml-1 text-danger">*</span>
          </label>

          <Input
            id="submissionPerMonitor"
            size="basic"
            type="number"
            min={0}
            step={1}
            placeholder="Nhập số lượng bài nộp"
            disabled={assigning}
            {...register('submissionPerMonitor')}
          />

          {errors.submissionPerMonitor && (
            <p className="mt-1 text-xs text-danger">
              {errors.submissionPerMonitor.message}
            </p>
          )}
        </div>

        {/* Information */}
        <div className="rounded-lg border border-border-default bg-bg-muted/40 p-3">
          <p className="text-sm text-text-secondary">
            Số lượng bài nộp được phân công sẽ áp dụng cho từng
            giảng viên trong danh sách đã chọn.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border-default pt-4">
          <Button
            type="button"
            variant="basic"
            onClick={handleClose}
            disabled={assigning}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="default"
            disabled={
              assigning ||
              loadingMonitors ||
              selectedMonitorIds.length === 0
            }
          >
            {assigning ? 'Đang phân công...' : 'Phân công'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
