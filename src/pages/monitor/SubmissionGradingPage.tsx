
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import {
    FiArrowLeft,
    FiAward,
    FiCheckCircle,
    FiEdit2,
} from "react-icons/fi"

import Button from "@/components/ui/button"
import Loading_Circle from "@/components/ui/loading_circle"

import useGetSubmissionGrading from "@/features/lecturer/grading_sessions/hooks/useGetSubmissionGrading"
import useReviewSubmission from "@/features/lecturer/grading_sessions/hooks/useReviewSubmision"

import { AnswerGradingCard } from "@/features/manager/grading_session/components/AnswerGradingCard"
import { HistoryGradingCard } from "@/features/manager/grading_session/components/GradingHistoryCard"
import MonitorGradingHistoryCard from "@/features/manager/grading_session/components/MonitorGradingHistoryCard"


import type { GradingHistoryType } from "@/features/lecturer/grading_sessions/types/grading_submisison_type"

import useUpdateGradingHistoryStatus from "@/features/manager/grading_session/hooks/useUpdateGradingHistoryStatus"
import ManualGradingModal from "@/features/manager/grading_session/components/ManualGradingModal"

export default function MonitorSubmissionGradingPage() {
    const { submissionId } = useParams<{ submissionId: string }>()
    const navigate = useNavigate()

    const [isManualGradingOpen, setIsManualGradingOpen] = useState(false)

    const {
        submissionGrading,
        loading,
        refresh,
    } = useGetSubmissionGrading(submissionId ?? "")

    // Chỉnh sửa kết quả chấm AI
    const {
        loading: reviewLoading,
        submitReview,
    } = useReviewSubmission({
        submissionId,
        onRefreshSubmissionDetail: refresh,
    })

    // Cập nhật trạng thái bản chấm chính thức
    const {
        updateStatus,
        loadingHistoryId,
    } = useUpdateGradingHistoryStatus()

    const answers = submissionGrading?.parsedAnswers ?? []
    const histories = submissionGrading?.histories ?? []

    // evaluationType: 0 = AI, 1 = Lecturer
    const aiHistories = histories.filter(
        (history) => history.evaluationType === 0,
    )

    const lecturerHistories = histories.filter(
        (history) => history.evaluationType === 1,
    )

    // Update Official Grading History
    const handleSetOfficial = async (historyId: string) => {
        const success = await updateStatus(historyId, 1)

        if (success) {
            await refresh()
        }
    }

    // Render Official Status
    const renderOfficialStatus = (history: GradingHistoryType) => {
        const isOfficial = history.status === 1
        const isUpdating = loadingHistoryId === history.historyId

        return (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-primary p-3">
                {isOfficial ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                        <FiCheckCircle size={17} />
                        Bản chấm chính thức (Official)
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                        <FiAward size={17} />
                        Chưa được chọn làm bản chính thức
                    </div>
                )}

                {!isOfficial && (
                    <button
                        type="button"
                        onClick={() => handleSetOfficial(history.historyId)}
                        disabled={loadingHistoryId !== null}
                        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand-orange px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orange/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <>
                                <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Đang cập nhật...
                            </>
                        ) : (
                            <>
                                <FiCheckCircle size={15} />
                                Đặt làm bản chính thức
                            </>
                        )}
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-md border border-border-default p-2 text-text-secondary transition-colors hover:bg-bg-muted"
                        title="Quay lại"
                    >
                        <FiArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl font-semibold text-text-primary">
                            Chi tiết bài chấm
                        </h1>

                        <p className="mt-1 text-sm text-text-secondary">
                            Xem câu trả lời, tiêu chí đánh giá và so sánh lịch sử chấm bài.
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={() => setIsManualGradingOpen(true)}
                    disabled={loading || !submissionGrading || answers.length === 0}
                >
                    <FiEdit2 size={16} />
                    Chấm thủ công
                </Button>
            </div>

            {loading ? (
                <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center text-sm text-text-muted">
                    <Loading_Circle />
                </div>
            ) : !submissionGrading ? (
                <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center text-sm text-text-muted">
                    Không tìm thấy dữ liệu chấm bài.
                </div>
            ) : (
                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                    {/* Left: Student answers */}
                    <div className="min-w-0 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary">
                                Bài làm của sinh viên
                            </h2>

                            <p className="mt-1 text-sm text-text-secondary">
                                {answers.length} câu trả lời
                            </p>
                        </div>

                        {answers.length === 0 ? (
                            <div className="rounded-lg border border-border-default bg-bg-primary p-8 text-center text-sm text-text-muted">
                                Không có câu trả lời nào.
                            </div>
                        ) : (
                            answers.map((answer) => (
                                <AnswerGradingCard
                                    key={answer.parsedAnswerId}
                                    answer={answer}
                                />
                            ))
                        )}
                    </div>

                    {/* Right: AI and Lecturer comparison */}
                    <aside className="min-w-0 space-y-4 xl:sticky xl:top-5">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary">
                                So sánh lịch sử chấm bài
                            </h2>

                            <p className="mt-1 text-sm text-text-secondary">
                                {histories.length} lần chấm đã được ghi nhận
                            </p>
                        </div>

                        {histories.length === 0 ? (
                            <div className="rounded-lg border border-border-default bg-bg-primary p-6 text-center text-sm text-text-muted">
                                Chưa có lịch sử chấm bài.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
                                {/* AI Grading */}
                                <section className="min-w-0 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-purple-700">
                                            AI Grading
                                        </h3>

                                        <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                            {aiHistories.length} lượt
                                        </span>
                                    </div>

                                    {aiHistories.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-border-default bg-bg-primary p-5 text-center text-sm text-text-muted">
                                            Chưa có lịch sử AI.
                                        </div>
                                    ) : (
                                        <div className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto pr-1">
                                            {aiHistories.map((history) => (
                                                <div
                                                    key={history.historyId}
                                                    className="space-y-2"
                                                >
                                                    {renderOfficialStatus(history)}

                                                    <HistoryGradingCard
                                                        history={history}
                                                        answers={answers}
                                                        onSave={submitReview}
                                                        loading={reviewLoading}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* Lecturer Grading */}
                                <section className="min-w-0 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-blue-700">
                                            Phần chấm của giám khảo
                                        </h3>

                                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                            {lecturerHistories.length} lượt
                                        </span>
                                    </div>

                                    {lecturerHistories.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-border-default bg-bg-primary p-5 text-center text-sm text-text-muted">
                                            Chưa có lịch sử Lecturer.
                                        </div>
                                    ) : (
                                        <div className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto pr-1">
                                            {lecturerHistories.map((history) => (
                                                <div
                                                    key={history.historyId}
                                                    className="space-y-2"
                                                >
                                                    {renderOfficialStatus(history)}

                                                    <MonitorGradingHistoryCard
                                                        history={history}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}
                    </aside>
                </div>
            )}

            {/* Manual Grading Modal */}
            <ManualGradingModal
                open={isManualGradingOpen}
                submissionId={submissionId ?? ""}
                answers={answers}
                onClose={() => setIsManualGradingOpen(false)}
                onRefresh={refresh}
            />
        </div>
    )
}
