import { FiUserPlus, FiX } from 'react-icons/fi'
import useSingleAssignGrading from '../hooks/useSingleAssignGrading'
import useGetStaffList from '../hooks/useGetStaffList'

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
    onRefresh
}: AssignGradingModalProps) {
    const {
        register,
        handleSubmit,
        errors,
        loading: assigning,
        onSubmit
    } = useSingleAssignGrading({
        gradingSessionId,
        onRefresh
    })

    const {
        monitorList,
        loading: loadingStaff
    } = useGetStaffList()

    const handleAssignSubmit = async (
        formData: Parameters<typeof onSubmit>[0]
    ) => {
        const isSuccess = await onSubmit(formData)

        if (isSuccess) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
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

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-2 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-primary"
                        aria-label="Đóng modal"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Form content */}
                <form
                    onSubmit={handleSubmit(handleAssignSubmit)}
                    className="flex flex-col"
                >
                    <div className="space-y-5 overflow-y-auto px-6 py-5">
                        {/* Staff select */}
                        <div>
                            <label
                                htmlFor="staffId"
                                className="mb-1.5 block text-sm font-medium text-text-primary"
                            >
                                Giảng viên
                                <span className="ml-1 text-danger">*</span>
                            </label>

                            <select
                                id="staffId"
                                {...register('staffId')}
                                disabled={loadingStaff || assigning}
                                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <option value="">
                                    {loadingStaff
                                        ? 'Đang tải danh sách giảng viên...'
                                        : '-- Chọn giảng viên --'}
                                </option>

                                {monitorList?.filter((staff) => staff.isActive).map((staff) => (
                                    <option
                                        key={staff.id}
                                        value={staff.id}
                                    >
                                        {staff.fullName} - {staff.staffCode}
                                    </option>
                                ))}
                            </select>

                            {errors.staffId && (
                                <p className="mt-1 text-xs text-danger">
                                    {errors.staffId.message}
                                </p>
                            )}

                            {!loadingStaff && monitorList?.filter((staff) => staff.isActive).length === 0 && (
                                <p className="mt-1 text-xs text-text-muted">
                                    Không có giảng viên đang hoạt động.
                                </p>
                            )}
                        </div>

                        {/* Number of submissions */}
                        <div>
                            <label
                                htmlFor="numberSubmissions"
                                className="mb-1.5 block text-sm font-medium text-text-primary"
                            >
                                Số lượng bài nộp
                                <span className="ml-1 text-danger">*</span>
                            </label>

                            <input
                                id="numberSubmissions"
                                type="number"
                                min={0}
                                step={1}
                                placeholder="Nhập số lượng bài nộp"
                                disabled={assigning}
                                {...register('numberSubmissions')}
                                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            {errors.numberSubmissions && (
                                <p className="mt-1 text-xs text-danger">
                                    {errors.numberSubmissions.message}
                                </p>
                            )}
                        </div>

                        {/* Information */}
                        <div className="rounded-lg border border-border-default bg-bg-muted/40 p-3">
                            <p className="text-sm text-text-secondary">
                                Số lượng bài nộp được phân công sẽ được gán cho giảng viên đã chọn trong phiên chấm hiện tại.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t border-border-default px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={assigning}
                            className="rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={assigning || loadingStaff || !monitorList?.some((staff) => staff.isActive)}
                            className="rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {assigning ? 'Đang phân công...' : 'Phân công'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}