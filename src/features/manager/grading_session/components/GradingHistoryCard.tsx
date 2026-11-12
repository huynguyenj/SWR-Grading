
import { useEffect, useState } from "react"
import type { GradingHistoryType, ParsedAnswerType } from "@/features/lecturer/grading_sessions/types/grading_submisison_type"
import { formatDate } from "@/utils/format"
import { FiClock, FiEdit2, FiX, FiSave } from "react-icons/fi"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import TextArea from "@/components/ui/textarea"

interface HistoryCardProps {
    history: GradingHistoryType
    answers: ParsedAnswerType[]
    onSave: (values: {
        baseHistoryId: string
        generalFeedback: string
        items: {
            parsedAnswerId: string
            score: number
            comment: string
        }[]
    }) => Promise<void>
    loading?: boolean
}

interface ReviewItemState {
    parsedAnswerId: string
    score: number
    comment: string
}

interface ReviewFormState {
    generalFeedback: string
    items: ReviewItemState[]
}

const formatScore = (score: number): string => {
    return Number.isInteger(score) ? score.toString() : score.toFixed(2)
}

export function HistoryGradingCard({
    history,
    answers,
    onSave,
    loading = false,
}: HistoryCardProps) {
    const [isEditing, setIsEditing] = useState(false)

    const [formData, setFormData] = useState<ReviewFormState>({
        generalFeedback: history.generalFeedback,
        items: [],
    })

    // Khởi tạo dữ liệu chỉnh sửa từ history đang được chọn
    useEffect(() => {
       const initialForm = () => {
             setFormData({
                 generalFeedback: history.generalFeedback ?? "",
                 items: history.details.map((detail) => ({
                     parsedAnswerId: detail.parsedAnswerId,
                     score: detail.score,
                     comment: detail.comment ?? "",
                 })),
             })
       }
       initialForm()
    }, [history])

    const handleCancel = () => {
        setFormData({
            generalFeedback: history.generalFeedback ?? "",
            items: history.details.map((detail) => ({
                parsedAnswerId: detail.parsedAnswerId,
                score: detail.score,
                comment: detail.comment ?? "",
            })),
        })

        setIsEditing(false)
    }

    const handleGeneralFeedbackChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            generalFeedback: value,
        }))
    }

    const handleItemChange = (
        index: number,
        field: "score" | "comment",
        value: string | number,
    ) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, [field]: value }
                    : item,
            ),
        }))
    }

    const handleSave = async () => {
        const invalidScore = formData.items.some((item, index) => {
            const detail = history.details[index]

            return (
                !Number.isFinite(item.score) ||
                item.score < 0 ||
                item.score > detail.maxScore
            )
        })

        if (invalidScore) {
            return
        }

        await onSave({
            baseHistoryId: history.historyId,
            generalFeedback: formData.generalFeedback,
            items: formData.items,
        })

        setIsEditing(false)
    }

    return (
        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
            {/* History header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-text-primary">
                        Lần chấm thứ {history.gradingRound}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                        <FiClock size={13} />
                        {formatDate(history.createdAt)}
                    </p>
                </div>

                <div className="shrink-0 rounded-lg bg-brand-orange/10 px-3 py-2 text-center">
                    <p className="text-lg font-bold text-brand-orange">
                        {formatScore(history.totalScore)}
                    </p>
                    <p className="text-xs text-text-secondary">
                        Tổng điểm
                    </p>
                </div>
            </div>

            {/* Edit / Cancel / Save actions */}
            <div className="mt-3 flex justify-end gap-2">
                {!isEditing ? (
                    <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                    >
                        <FiEdit2 size={14} />
                    </Button>
                ) : (
                    <>
                        <Button
                            type="button"
                            disabled={loading}
                            onClick={handleCancel}
                            variant='basic'
                        >
                            <FiX size={14} />
                            Hủy
                        </Button>

                        <Button
                            type="button"
                            disabled={loading}
                            onClick={handleSave}
                        >
                            <FiSave size={14} />
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </>
                )}
            </div>

            {/* General feedback */}
            <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Nhận xét chung
                </p>

                {isEditing ? (
                    <TextArea
                        value={formData.generalFeedback}
                        onChange={(e) =>
                            handleGeneralFeedbackChange(e.target.value)
                        }
                        rows={4}
                        disabled={loading}
                        placeholder="Nhập nhận xét chung..."
                    />
                ) : (
                    <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                        {history.generalFeedback || "Không có nhận xét chung."}
                    </p>
                )}
            </div>

            {/* Question grading details */}
            <div className="mt-4 border-t border-border-default pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Chi tiết điểm theo câu
                </p>

                <div className="space-y-3">
                    {history.details.map((detail, index) => {
                        const answer = answers.find(
                            (item) =>
                                item.parsedAnswerId === detail.parsedAnswerId,
                        )

                        const currentItem = formData.items[index]

                        return (
                            <div
                                key={detail.detailId}
                                className="rounded-md bg-bg-muted/40 p-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-medium text-text-primary">
                                        {detail.questionTitle}
                                    </p>

                                    {isEditing ? (
                                        <div className="flex shrink-0 items-center gap-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                size='basic'
                                                max={detail.maxScore}
                                                step="0.01"
                                                value={currentItem?.score ?? 0}
                                                disabled={loading}
                                                onChange={(e) =>
                                                    handleItemChange(
                                                        index,
                                                        "score",
                                                        e.target.value === ""
                                                            ? 0
                                                            : Number(e.target.value),
                                                    )
                                                }
                                            />

                                            <span className="text-sm text-text-muted">
                                                / {formatScore(detail.maxScore)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="shrink-0 text-sm font-semibold text-brand-orange">
                                            {formatScore(detail.score)} / {formatScore(detail.maxScore)}
                                        </span>
                                    )}
                                </div>

                                {/* Comment */}
                                <div className="mt-2">
                                    {isEditing ? (
                                        <TextArea
                                            value={currentItem?.comment ?? ""}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "comment",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            disabled={loading}
                                            placeholder="Nhập nhận xét cho câu trả lời..."
                                        />
                                    ) : (
                                        detail.comment && (
                                            <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                                                {detail.comment}
                                            </p>
                                        )
                                    )}
                                </div>

                                {!answer && (
                                    <p className="mt-1 text-xs text-text-muted">
                                        Không tìm thấy câu trả lời tương ứng.
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
