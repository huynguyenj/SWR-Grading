import type { ParsedAnswerType } from "@/features/lecturer/grading_sessions/types/grading_submisison_type"
import { formatScore } from "@/utils/format"
import { FiFileText } from "react-icons/fi"

interface AnswerCardProps {
    answer: ParsedAnswerType
}

export function AnswerGradingCard({ answer }: AnswerCardProps) {
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