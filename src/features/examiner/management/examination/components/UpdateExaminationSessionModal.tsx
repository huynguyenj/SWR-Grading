
import Modal from "@/components/ui/modal"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"


import type { ExaminationSessionType } from "../types/exam_session"
import {
    SESSION_STATUS_LABEL,
} from "../types/exam_session"

import { useEffect } from "react"
import { Controller } from "react-hook-form"
import useUpdateExaminationSession from "../hooks/useUpdateExaminationSession"

interface UpdateExaminationSessionModalProps {
    open: boolean
    onClose: () => void
    onRefresh: () => void
    session?: ExaminationSessionType
}

const statusOptions = Object.entries(SESSION_STATUS_LABEL).map(
    ([value, label]) => ({
        value,
        label,
    }),
)

export default function UpdateExaminationSessionModal({
    open,
    onClose,
    onRefresh,
    session,
}: UpdateExaminationSessionModalProps) {
    const {
        handleSubmit,
        onSubmit,
        updateRegister,
        errors,
        reset,
        control,
        setSelectedExaminationId,
        setSelectedSessionId,
        loading,
    } = useUpdateExaminationSession({
        onRefresh,
    })

    useEffect(() => {
        if (!open || !session) return

        reset({
            examinationCode: session.examinationCode,
            startDate: session.startDate,
            startTime: session.startTime,
            status: String(session.status),
        })

        setSelectedExaminationId(session.examinationId)
        setSelectedSessionId(session.examinationSessionId)
    }, [
        open,
        session,
        reset,
        setSelectedExaminationId,
        setSelectedSessionId,
    ])

    const handleUpdate = async (
        data: Parameters<typeof onSubmit>[0],
    ) => {
        const success = await onSubmit(data)

        if (success) {
            onClose()
        }
    }

    if (!open) return null

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Cập nhật đợt thi"
        >
            <form
                onSubmit={handleSubmit(handleUpdate)}
                className="space-y-4 px-5 py-4"
            >
                {/* Examination code */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Mã đợt thi
                    </label>

                    <Input
                        {...updateRegister("examinationCode")}
                        size="basic"
                        placeholder="VD: SWR302_PE_R1"
                        error={errors.examinationCode?.message}
                    />
                </div>

                {/* Start date */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Ngày bắt đầu
                    </label>

                    <input
                        {...updateRegister("startDate")}
                        type="date"
                        className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
                    />

                    {errors.startDate?.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.startDate.message}
                        </p>
                    )}
                </div>

                {/* Start time */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Giờ bắt đầu
                    </label>

                    <input
                        {...updateRegister("startTime")}
                        type="time"
                        className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
                    />

                    {errors.startTime?.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.startTime.message}
                        </p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                        Trạng thái
                    </label>

                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <select
                                {...field}
                                className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    />

                    {errors.status?.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.status.message}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="basic"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </Button>

                    <Button
                        type="submit"
                        variant="default"
                        disabled={loading}
                        className="disabled:bg-bg-muted disabled:text-text-muted"
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
