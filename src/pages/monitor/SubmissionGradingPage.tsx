
import useGetSubmissionGrading from "@/features/lecturer/grading_sessions/hooks/useGetSubmissionGrading"
import { AnswerGradingCard } from "@/features/manager/grading_session/components/AnswerGradingCard"
import { HistoryGradingCard } from "@/features/manager/grading_session/components/GradingHistoryCard"
import MonitorGradingHistoryCard from "@/features/manager/grading_session/components/MonitorGradingHistoryCard"
import useReviewSubmission from "@/features/manager/grading_session/hooks/useReviewSubmision"
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate, useParams } from "react-router"

export default function MonitorSubmissionGradingPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const navigate = useNavigate()

  const {
    submissionGrading,
    loading,
    refresh,
  } = useGetSubmissionGrading(submissionId ?? "")

  const {
    loading: reviewLoading,
    submitReview,
  } = useReviewSubmission({
    submissionId,
    onRefreshSubmissionDetail: refresh,
  })

  const answers = submissionGrading?.parsedAnswers ?? []
  const histories = submissionGrading?.histories ?? []

  // evaluationType: 0 = AI, 1 = Lecturer
  const aiHistories = histories.filter(
    (history) => history.evaluationType === 0,
  )

  const lecturerHistories = histories.filter(
    (history) => history.evaluationType === 1,
  )

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
            Xem câu trả lời, tiêu chí đánh giá và so sánh lịch sử chấm bài.
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
                        <HistoryGradingCard
                          key={history.historyId}
                          history={history}
                          answers={answers}
                          onSave={submitReview}
                          loading={reviewLoading}
                        />
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
                        <MonitorGradingHistoryCard
                          key={history.historyId}
                          history={history}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
