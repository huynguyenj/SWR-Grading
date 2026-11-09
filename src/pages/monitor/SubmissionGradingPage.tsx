import useGetSubmissionGrading from "@/features/lecturer/grading_sessions/hooks/useGetSubmissionGrading"
import type { GradingHistoryType, ParsedAnswerType } from "@/features/lecturer/grading_sessions/types/grading_submisison_type"
import { FiArrowLeft, FiClock, FiFileText } from "react-icons/fi"
import { useNavigate, useParams } from "react-router"


const formatDateTime = (date: string): string => {
    if (!date) return '--'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return '--'

    return parsedDate.toLocaleString('vi-VN')
}

const formatScore = (score: number): string => {
    return Number.isInteger(score) ? score.toString() : score.toFixed(2)
}

interface AnswerCardProps {
    answer: ParsedAnswerType
}

function AnswerCard({ answer }: AnswerCardProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border-default bg-bg-primary">
            {/* Question header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default bg-bg-muted/40 px-5 py-4">
                <div>
                    <h2 className="font-semibold text-text-primary">
                        {answer.questionTitle}
                    </h2>

                    <p className="mt-1 text-xs text-text-muted">
                        Tiêu chí chấm điểm
                    </p>
                </div>

                <div className="rounded-md bg-brand-orange/10 px-3 py-1.5 text-sm font-semibold text-brand-orange">
                    Tối đa {formatScore(answer.maxScore)} điểm
                </div>
            </div>

            <div className="space-y-5 p-5">
                {/* Student answer */}
                <section>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <FiFileText className="text-brand-orange" size={17} />
                        Câu trả lời của sinh viên
                    </h3>

                    <div className="min-h-24 rounded-md border border-border-default bg-bg-muted/30 p-4">
                        {answer.extractedText ? (
                              <div>
                                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-text-primary">
                                          {answer.extractedText}
                                    </p>
                                    { answer.extractedImageUrl &&
                                          <img src={answer.extractedImageUrl} alt="image" className="my-5 max-w-250 max-h-250"/>
                                    }
                              </div>
                        ) : (
                            <p className="text-sm italic text-text-muted">
                                Không có nội dung văn bản được trích xuất.
                            </p>
                        )}
                    </div>
                </section>

                {/* Criteria */}
                <section>
                    <h3 className="mb-3 text-sm font-semibold text-text-primary">
                        Rubric / Tiêu chí đánh giá
                    </h3>

                    <div className="overflow-hidden rounded-md border border-border-default">
                        {answer.criteria.length === 0 ? (
                            <p className="p-4 text-sm text-text-muted">
                                Không có tiêu chí chấm điểm.
                            </p>
                        ) : (
                            <div className="divide-y divide-border-default">
                                {answer.criteria.map((criterion, index) => (
                                    <div
                                        key={`${answer.questionId}-criteria-${index}`}
                                        className="flex items-start justify-between gap-4 px-4 py-3"
                                    >
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                                            {criterion.criteria}
                                        </p>

                                        <span className="shrink-0 rounded bg-bg-muted px-2 py-1 text-xs font-semibold text-text-primary">
                                            {formatScore(criterion.point)} điểm
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

interface HistoryCardProps {
    history: GradingHistoryType
    answers: ParsedAnswerType[]
}

function HistoryCard({ history, answers }: HistoryCardProps) {
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
                        {formatDateTime(history.createdAt)}
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

            {/* General feedback */}
            <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Nhận xét chung
                </p>

                <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                    {history.generalFeedback || 'Không có nhận xét chung.'}
                </p>
            </div>

            {/* Question grading details */}
            <div className="mt-4 border-t border-border-default pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Chi tiết điểm theo câu
                </p>

                <div className="space-y-3">
                    {history.details.map(detail => {
                        const answer = answers.find(
                            item => item.questionId === detail.questionId
                        )

                        return (
                            <div
                                key={detail.detailId}
                                className="rounded-md bg-bg-muted/40 p-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm font-medium text-text-primary">
                                        {detail.questionTitle}
                                    </p>

                                    <span className="shrink-0 text-sm font-semibold text-brand-orange">
                                        {formatScore(detail.score)} / {formatScore(detail.maxScore)}
                                    </span>
                                </div>

                                {detail.comment && (
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                                        {detail.comment}
                                    </p>
                                )}

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

export default function MonitorSubmissionGradingPage() {
    const { submissionId } = useParams<{ submissionId: string }>()
    const navigate = useNavigate()

    const {
        submissionGrading,
        loading
    } = useGetSubmissionGrading(submissionId ?? '')

    const answers = submissionGrading?.parsedAnswers ?? []
    const histories = submissionGrading?.histories ?? []

    return (
        <div className="space-y-5">
            {/* Header */}
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
                        Xem câu trả lời, tiêu chí đánh giá và lịch sử chấm bài.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center text-sm text-text-muted">
                    Đang tải dữ liệu chấm bài...
                </div>
            ) : !submissionGrading ? (
                <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center text-sm text-text-muted">
                    Không tìm thấy dữ liệu chấm bài.
                </div>
            ) : (
                <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
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
                            answers.map(answer => (
                                <AnswerCard
                                    key={answer.parsedAnswerId}
                                    answer={answer}
                                />
                            ))
                        )}
                    </div>

                    {/* Right: Grading histories */}
                    <aside className="min-w-0 space-y-4 xl:sticky xl:top-5">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary">
                                Lịch sử chấm bài
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
                            <div className="max-h-[calc(100vh-180px)] space-y-4 overflow-y-auto pr-1">
                                {histories.map(history => (
                                    <HistoryCard
                                        key={history.historyId}
                                        history={history}
                                        answers={answers}
                                    />
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            )}
        </div>
    )
}