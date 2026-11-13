
import { useState } from 'react'
import { FiUserPlus, FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import Button from '@/components/ui/button'
import useMultipleAssignment from '../hooks/useMultipleAssignment'
import useGetStaffList from '../hooks/useGetStaffList'
import Input from '@/components/ui/input'

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
    // Selected staff in dropdown
    const [selectedStaffId, setSelectedStaffId] = useState('')
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
    } = useMultipleAssignment({ gradingSessionId, onRefresh})

    const { monitorList, loading: loadingStaff } = useGetStaffList()

    // Only display active staff
    const activeMonitorList = monitorList?.filter((staff) => staff.isActive) ?? []
    // Resolve selected monitor IDs into staff information
    const selectedMonitors = activeMonitorList.filter((staff) => selectedMonitorIds.includes(staff.id))

    // Available staff that have not been selected
    const availableMonitors = activeMonitorList.filter((staff) => !selectedMonitorIds.includes(staff.id))

    // Add selected staff
    const handleAddMonitor = () => {
        if (!selectedStaffId) return
        addMonitor(selectedStaffId)
        setSelectedStaffId('')
    }

    // Submit assignment
    const handleAssignSubmit = async (
        formData: Parameters<typeof onSubmit>[0],
    ) => {
        const isSuccess = await onSubmit(formData)

        if (isSuccess) {
            setSelectedStaffId('')
            onClose()
        }
    }

    // Close modal and reset form
    const handleClose = () => {
        if (assigning) return
        reset()
        setSelectedStaffId('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="assign-grading-title"
                className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border-default bg-bg-primary shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                            <FiUserPlus size={20} />
                        </div>

                        <div>
                            <h2
                                id="assign-grading-title"
                                className="text-lg font-semibold text-text-primary"
                            >
                                Phân công giảng viên
                            </h2>

                            <p className="text-sm text-text-secondary">
                                Chọn giảng viên và số lượng bài nộp cần chấm
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="basic"
                        size="basic"
                        onClick={handleClose}
                        disabled={assigning}
                        title="Đóng modal"
                    >
                        <FiX size={20} />
                    </Button>
                </div>

                {/* Form content */}
                <form
                    onSubmit={handleSubmit(handleAssignSubmit)}
                    className="flex min-h-0 flex-col"
                >
                    <div className="space-y-5 overflow-y-auto px-6 py-5">
                        {/* Staff selection */}
                        <div>
                            <label
                                htmlFor="staffId"
                                className="mb-1.5 block text-sm font-medium text-text-primary"
                            >
                                Giảng viên
                                <span className="ml-1 text-danger">*</span>
                            </label>

                            <div className="flex items-center gap-2">
                                <select
                                    id="staffId"
                                    value={selectedStaffId}
                                    onChange={(event) =>
                                        setSelectedStaffId(event.target.value)
                                    }
                                    disabled={
                                        loadingStaff ||
                                        assigning ||
                                        availableMonitors.length === 0
                                    }
                                    className="h-10 min-w-0 flex-1 rounded-md border border-border-default bg-bg-primary px-3 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <option value="">
                                        {loadingStaff
                                            ? 'Đang tải danh sách giảng viên...'
                                            : availableMonitors.length === 0
                                              ? 'Không còn giảng viên để chọn'
                                              : '-- Chọn giảng viên --'}
                                    </option>

                                    {availableMonitors.map((staff) => (
                                        <option
                                            key={staff.id}
                                            value={staff.id}
                                        >
                                            {staff.fullName} - {staff.staffCode}
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

                            <div className="space-y-2">
                                {selectedMonitors.length > 0 ? (
                                    selectedMonitors.map((staff) => (
                                        <div
                                            key={staff.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-surface px-3 py-2.5"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-sm font-semibold text-brand-orange">
                                                    {staff.fullName
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-text-primary">
                                                        {staff.fullName}
                                                    </p>

                                                    <p className="text-xs text-text-muted">
                                                        {staff.staffCode}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="basic"
                                                size="basic"
                                                className="shrink-0! border-danger/20! text-danger! hover:bg-danger/10!"
                                                onClick={() =>
                                                    removeMonitor(staff.id)
                                                }
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
                                size='basic'
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
                                Số lượng bài nộp được phân công sẽ áp dụng
                                cho từng giảng viên trong danh sách đã chọn.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t border-border-default px-6 py-4">
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
                                loadingStaff ||
                                selectedMonitorIds.length === 0
                            }
                        >
                            {assigning
                                ? 'Đang phân công...'
                                : 'Phân công'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
