
import { useEffect } from "react"
import { Controller } from "react-hook-form"
import { FiAlertCircle, FiClipboard, FiSave, FiX } from "react-icons/fi"
import { toast } from "react-toastify"

import Modal from "@/components/ui/modal"
import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import TextArea from "@/components/ui/textarea"

import { AnswerGradingCard } from "@/features/manager/grading_session/components/AnswerGradingCard"

import useLecturerGrading from "@/features/lecturer/grading_sessions/hooks/useLecturerGrading"

import type { ParsedAnswerType } from "@/features/lecturer/grading_sessions/types/grading_submisison_type"
import getQuestionNumber from "@/features/lecturer/grading_sessions/utils/question_helper"

interface ManualGradingModalProps {
    open: boolean
    submissionId: string
    answers: ParsedAnswerType[]
    onClose: () => void
    onRefresh: () => void
}

export default function ManualGradingModal({
    open,
    submissionId,
    answers,
    onClose,
    onRefresh,
}: ManualGradingModalProps) {
    const {
        loading,
        control,
        handleSubmit,
        register,
        errors,
        submitLecturerGrading,
        resetLecturerGrading,
    } = useLecturerGrading({
        submissionId,
        onRefreshSubmissionDetail: onRefresh,
    })

    useEffect(() => {
        if (!open) return

        resetLecturerGrading({
            generalFeedback: "",
            items: answers.map((answer, index) => ({
                questionNumber: getQuestionNumber(
                    answer.questionTitle,
                    index,
                ),
                score: 0,
                comment: "",
            })),
        })
    }, [open, answers, resetLecturerGrading])

    const handleClose = () => {
        if (loading) return

        resetLecturerGrading({
            generalFeedback: "",
            items: [],
        })

        onClose()
    }

    const handleFormSubmit = handleSubmit(async (values) => {
        const invalidIndex = values.items.findIndex((item, index) => {
            const answer = answers[index]

            return answer && item.score > answer.maxScore
        })

        if (invalidIndex !== -1) {
            const answer = answers[invalidIndex]

            toast.error(
                `${answer?.questionTitle ?? `Câu ${invalidIndex + 1}`}: Điểm không được vượt quá ${answer?.maxScore}.`,
            )

            return
        }

        const success = await submitLecturerGrading(values)

        if (success) {
            onClose()
        }
    })

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Chấm điểm thủ công"
            maxWidth="xl"
        >
            <form
                onSubmit={handleFormSubmit}
                className="flex max-h-[80vh] flex-col px-4 py-3"
            >
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-2">


                    {/* Answer grading */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-text-primary">
                                Chi tiết chấm điểm
                            </h3>

                            <span className="rounded-full bg-bg-muted px-3 py-1 text-xs font-medium text-text-secondary">
                                {answers.length} câu hỏi
                            </span>
                        </div>

                        {answers.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border-default p-6 text-center text-sm text-text-muted">
                                Không có câu trả lời để chấm điểm.
                            </div>
                        ) : (
                            answers.map((answer, index) => (
                                <div
                                    key={answer.parsedAnswerId}
                                    className="space-y-3 rounded-lg border border-border-default bg-bg-primary p-4"
                                >
                                    <AnswerGradingCard answer={answer} />

                                    <input
                                        type="hidden"
                                        {...register(
                                            `items.${index}.questionNumber`,
                                            { valueAsNumber: true },
                                        )}
                                    />

                                    {/* Score */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">
                                            Điểm đánh giá
                                        </label>

                                        <div className="flex items-center gap-3">
                                            <Controller
                                                name={`items.${index}.score`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={answer.maxScore}
                                                        step="0.01"
                                                        value={field.value}
                                                        disabled={loading}
                                                        onChange={(event) => {
                                                            field.onChange(
                                                                event.target.value === ""
                                                                    ? 0
                                                                    : Number(event.target.value),
                                                            )
                                                        }}
                                                        className="w-32"
                                                    />
                                                )}
                                            />

                                            <span className="text-sm text-text-secondary">
                                                / {answer.maxScore}
                                            </span>
                                        </div>

                                        {errors.items?.[index]?.score && (
                                            <p className="text-xs text-red-500">
                                                {errors.items[index]?.score?.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Comment */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-text-primary">
                                            Nhận xét câu trả lời
                                        </label>

                                        <Controller
                                            name={`items.${index}.comment`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextArea
                                                    rows={2}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    disabled={loading}
                                                    placeholder="Nhập nhận xét cho câu trả lời này..."
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                    {/* General feedback */}
                    <section className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FiClipboard
                                size={17}
                                className="text-brand-orange"
                            />

                            <h3 className="text-sm font-semibold text-text-primary">
                                Nhận xét tổng quan
                            </h3>
                        </div>

                        <Controller
                            name="generalFeedback"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    rows={3}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Nhập nhận xét tổng quan về bài làm..."
                                    disabled={loading}
                                />
                            )}
                        />
                    </section>
                    <div className="flex items-start gap-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
                        <FiAlertCircle className="mt-0.5 shrink-0" />

                        <p>
                            Vui lòng kiểm tra điểm số và nhận xét trước khi
                            lưu. Kết quả sẽ được ghi nhận dưới hình thức
                            chấm điểm của giám khảo.
                        </p>
                    </div>
                    
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end gap-3 border-t border-border-default pt-4">
                    <Button
                        type="button"
                        variant="basic"
                        disabled={loading}
                        onClick={handleClose}
                    >
                        <FiX size={16} />
                        Hủy
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading || answers.length === 0}
                    >
                        <FiSave size={16} />
                        {loading ? "Đang lưu..." : "Lưu kết quả chấm"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
