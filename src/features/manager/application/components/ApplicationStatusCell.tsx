
import { useState } from 'react'
import { FiEdit2, FiSave, FiX } from 'react-icons/fi'

import Button from '@/components/ui/button'
import type { ApplicationStatus } from '@/features/student/application/types/application_type'
import useUpdateManagerApplicationStatus from '../hooks/useUpdateManagerApplicationStatus'
import { applicationStatusConfig } from '@/features/student/application/const/application_status'

interface ApplicationStatusCellProps {
    applicationId: string
    status: ApplicationStatus
    onRefresh: () => void
}

const statusOptions: ApplicationStatus[] = [0, 1, 2, 3, 4]

export default function ApplicationStatusCell({
    applicationId,
    status,
    onRefresh,
}: ApplicationStatusCellProps) {
    const [isEditing, setIsEditing] = useState(false)

    const {
        register,
        handleSubmit,
        loading,
        onSubmit,
        reset,
    } = useUpdateManagerApplicationStatus({
        applicationId,
        currentStatus: status,
        onRefresh,
    })

    const handleCancel = () => {
        reset({ status })
        setIsEditing(false)
    }

    const handleUpdate = async (
        formData: Parameters<typeof onSubmit>[0],
    ) => {
        const isSuccess = await onSubmit(formData)

        if (isSuccess) {
            setIsEditing(false)
        }
    }

    const statusConfig = applicationStatusConfig[status]

    // View mode
    if (!isEditing) {
        return (
            <div className="flex items-center gap-2">
                {statusConfig ? (
                    <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.className}`}
                    >
                        {statusConfig.label}
                    </span>
                ) : (
                    <span className="text-xs text-text-muted">
                        Không xác định
                    </span>
                )}

                <Button
                    type="button"
                    variant="basic"
                    size="basic"
                    onClick={() => setIsEditing(true)}
                    title="Chỉnh sửa trạng thái"
                >
                    <FiEdit2 size={15} />
                </Button>
            </div>
        )
    }

    // Edit mode
    return (
        <form
            onSubmit={handleSubmit(handleUpdate)}
            className="flex min-w-52 items-center gap-2"
        >
            <select
                {...register('status', {
                    valueAsNumber: true,
                })}
                disabled={loading}
                className="h-9 min-w-0 flex-1 rounded-md border border-border-default bg-bg-primary px-2 text-xs text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {statusOptions.map((value) => (
                    <option key={value} value={value}>
                        {applicationStatusConfig[value].label}
                    </option>
                ))}
            </select>

            <Button
                type="submit"
                variant="default"
                size="basic"
                disabled={loading}
                title="Lưu trạng thái"
            >
                <FiSave size={15} />
            </Button>

            <Button
                type="button"
                variant="basic"
                size="basic"
                disabled={loading}
                onClick={handleCancel}
                title="Hủy chỉnh sửa"
            >
                <FiX size={15} />
            </Button>
        </form>
    )
}
