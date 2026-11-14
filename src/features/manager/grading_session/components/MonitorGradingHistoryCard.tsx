
import type { GradingHistoryType } from "@/features/lecturer/grading_sessions/types/grading_submisison_type"

import { useState } from "react"
import { toast } from "react-toastify"
import { FiChevronDown, FiChevronUp, FiClock, FiMessageSquare, FiEdit2, FiSave, FiX} from "react-icons/fi"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import TextArea from "@/components/ui/textarea"
import useUpdateGradingDetail from "../hooks/useUpdateGradingDetail"
import { formatDate } from "@/utils/format"
import { getStatusClass, getStatusLabel } from "../const/grading_status"

interface MonitorGradingHistoryCardProps {
    history: GradingHistoryType
    onRefresh?: () => void
}

interface EditGradingDetailType {
    score: number
    comment: string
}

export default function MonitorGradingHistoryCard({
    history,
    onRefresh,
}: MonitorGradingHistoryCardProps) {
    const [expanded, setExpanded] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const [editDetails, setEditDetails] = useState<
        Record<string, EditGradingDetailType>
    >({})

    const [editingDetails, setEditingDetails] = useState<string[]>([])
    const [savingDetails, setSavingDetails] = useState<string[]>([])

    const { updateGradingDetail } = useUpdateGradingDetail()


    // Enable edit mode for all details
    const handleEdit = () => {
        const initialDetails: Record<string, EditGradingDetailType> = {}

        history.details.forEach((detail) => {
            initialDetails[detail.detailId] = {
                score: detail.score,
                comment: detail.comment ?? "",
            }
        })

        setEditDetails(initialDetails)
        setEditingDetails(history.details.map((detail) => detail.detailId))
        setIsEditing(true)
    }

    // Cancel editing one detail
    const handleCancelDetail = (detailId: string) => {
        const originalDetail = history.details.find(
            (detail) => detail.detailId === detailId,
        )

        if (!originalDetail) return

        setEditDetails((previous) => ({
            ...previous,
            [detailId]: {
                score: originalDetail.score,
                comment: originalDetail.comment ?? "",
            },
        }))

        setEditingDetails((previous) =>
            previous.filter((id) => id !== detailId),
        )
    }

    // Update local edit data
    const handleDetailChange = (
        detailId: string,
        field: keyof EditGradingDetailType,
        value: string | number,
    ) => {
        setEditDetails((previous) => ({
            ...previous,
            [detailId]: {
                ...previous[detailId],
                [field]: value,
            },
        }))
    }

    // Save one grading detail
    const handleSaveDetail = async (detailId: string) => {
        const detail = history.details.find(
            (item) => item.detailId === detailId,
        )

        const editData = editDetails[detailId]

        if (!detail || !editData) return

        if (
            !Number.isFinite(editData.score) ||
            editData.score < 0 ||
            editData.score > detail.maxScore
        ) {
            toast.error(
                `${detail.questionTitle}: Score must be between 0 and ${detail.maxScore}`,
            )
            return
        }

        setSavingDetails((previous) => [...previous, detailId])

        try {
            await updateGradingDetail(detailId, {
                score: editData.score,
                comment: editData.comment,
            })

            toast.success(`${detail.questionTitle} updated successfully`)

            setEditingDetails((previous) =>
                previous.filter((id) => id !== detailId),
            )

            onRefresh?.()
        } catch {
            toast.error(`Failed to update ${detail.questionTitle}`)
        } finally {
            setSavingDetails((previous) =>
                previous.filter((id) => id !== detailId),
            )
        }
    }

    // Exit edit mode
    const handleFinishEditing = () => {
        setIsEditing(false)
        setEditingDetails([])
        setEditDetails({})
    }

    const isSaving = (detailId: string) =>
        savingDetails.includes(detailId)

    const isDetailEditing = (detailId: string) =>
        editingDetails.includes(detailId)

    return (
        <div className="overflow-hidden rounded-xl border border-border-default bg-bg-primary">
            {/* Header */}
            <button
                type="button"
                onClick={() => setExpanded((previous) => !previous)}
                className="flex w-full items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-bg-muted/50"
            >
                <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            Bài chấm giảng viên
                        </span>

                        <span className="rounded-md bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
                            Lần {history.gradingRound}
                        </span>

                        <span
                            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusClass(history.status)}`}
                        >
                            {getStatusLabel(history.status)}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div>
                            <p className="text-xs text-text-secondary">
                                Total Score
                            </p>
                            <p className="text-xl font-bold text-text-primary">
                                {history.totalScore}
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <FiClock size={14} />
                            <span>{formatDate(history.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-1 shrink-0 text-text-secondary">
                    {expanded ? (
                        <FiChevronUp size={20} />
                    ) : (
                        <FiChevronDown size={20} />
                    )}
                </div>
            </button>

            {expanded && (
                <div className="space-y-4 border-t border-border-default p-4">
                    {/* General feedback */}
                    <section className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FiMessageSquare
                                className="text-text-secondary"
                                size={15}
                            />
                            <h4 className="text-sm font-semibold text-text-primary">
                                General Feedback
                            </h4>
                        </div>

                        <div className="rounded-lg bg-bg-muted p-3">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                                {history.generalFeedback?.trim() ||
                                    "No general feedback."}
                            </p>
                        </div>
                    </section>

                    {/* Question details */}
                    <section className="space-y-3">
                        <h4 className="text-sm font-semibold text-text-primary">
                            Question Details ({history.details.length})
                        </h4>

                        {history.details.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border-default p-4 text-center text-sm text-text-muted">
                                No question details available.
                            </div>
                        ) : (
                            history.details.map((detail, index) => {
                                const editData = editDetails[detail.detailId]
                                const detailEditing = isDetailEditing(detail.detailId)
                                const detailSaving = isSaving(detail.detailId)

                                return (
                                    <div
                                        key={detail.detailId}
                                        className="space-y-3 rounded-lg border border-border-default p-3"
                                    >
                                        {/* Question header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-start gap-2">
                                                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-bg-muted text-xs font-semibold text-text-secondary">
                                                    {index + 1}
                                                </span>

                                                <p className="text-sm font-semibold text-text-primary">
                                                    {detail.questionTitle}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1">
                                                {detailEditing ? (
                                                    <>
                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            min={0}
                                                            max={detail.maxScore}
                                                            step="0.01"
                                                            disabled={detailSaving}
                                                            value={editData?.score ?? detail.score}
                                                            onChange={(e) =>
                                                                handleDetailChange(
                                                                    detail.detailId,
                                                                    "score",
                                                                    e.target.value === ""
                                                                        ? 0
                                                                        : Number(e.target.value),
                                                                )
                                                            }
                                                            className="w-20 text-center font-semibold"
                                                        />

                                                        <span className="text-xs text-text-secondary">
                                                            / {detail.maxScore}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <p className="text-base font-bold text-text-primary">
                                                        {detail.score}
                                                        <span className="text-xs font-normal text-text-secondary">
                                                            {" "}/ {detail.maxScore}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <div className="flex items-start gap-2 rounded-md bg-bg-muted p-3">
                                            <FiMessageSquare
                                                className="mt-0.5 shrink-0 text-text-secondary"
                                                size={14}
                                            />

                                            {detailEditing ? (
                                                <TextArea
                                                    rows={3}
                                                    disabled={detailSaving}
                                                    value={editData?.comment ?? ""}
                                                    onChange={(e) =>
                                                        handleDetailChange(
                                                            detail.detailId,
                                                            "comment",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Enter your comment..."
                                                    className="bg-bg-primary"
                                                />
                                            ) : (
                                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                                                    {detail.comment?.trim() ||
                                                        "No comment for this question."}
                                                </p>
                                            )}
                                        </div>

                                        {/* Individual actions */}
                                        {detailEditing && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="basic"
                                                    size="sm"
                                                    disabled={detailSaving}
                                                    onClick={() =>
                                                        handleCancelDetail(detail.detailId)
                                                    }
                                                >
                                                    <FiX size={14} />
                                                    Cancel
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    disabled={detailSaving}
                                                    onClick={() =>
                                                        handleSaveDetail(detail.detailId)
                                                    }
                                                >
                                                    <FiSave size={14} />
                                                    {detailSaving ? "Saving..." : "Save"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </section>

                    {/* Edit actions */}
                    <div className="flex justify-end border-t border-border-default pt-4">
                        {isEditing && editingDetails.length > 0 ? (
                            <Button
                                variant="basic"
                                onClick={handleFinishEditing}
                                disabled={savingDetails.length > 0}
                            >
                                <FiX size={16} />
                                Chỉnh sửa xong
                            </Button>
                        ) : !isEditing ? (
                            <Button
                                variant="basic"
                                onClick={handleEdit}
                            >
                                <FiEdit2 size={16} />
                                Sửa
                            </Button>
                        ) : (
                            <Button
                                variant="basic"
                                onClick={handleFinishEditing}
                            >
                               Xong
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
