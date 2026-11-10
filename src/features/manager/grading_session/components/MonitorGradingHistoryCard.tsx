
import type { GradingHistoryType } from "@/features/lecturer/grading_sessions/types/grading_submisison_type"
import { useState } from "react"
import {
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi"

interface MonitorGradingHistoryCardProps {
  history: GradingHistoryType
}

export default function MonitorGradingHistoryCard({
  history,
}: MonitorGradingHistoryCardProps) {
  const [expanded, setExpanded] = useState(true)

  const formattedDate = new Date(history.createdAt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return "Pending"
      case 1:
        return "Completed"
      case 2:
        return "Failed"
      default:
        return "Unknown"
    }
  }

  const getStatusClass = (status: number): string => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-700"
      case 1:
        return "bg-green-100 text-green-700"
      case 2:
        return "bg-red-100 text-red-700"
      default:
        return "bg-bg-secondary text-text-secondary"
    }
  }

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
              Lecturer Grading
            </span>

            <span className="rounded-md bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary">
              Round {history.gradingRound}
            </span>

            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                history.status,
              )}`}
            >
              {getStatusLabel(history.status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div>
              <p className="text-xs text-text-secondary">Total Score</p>
              <p className="text-xl font-bold text-text-primary">
                {history.totalScore}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <FiClock size={14} />
              <span>{formattedDate}</span>
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
                {history.generalFeedback?.trim() || "No general feedback."}
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
              history.details.map((detail, index) => (
                <div
                  key={detail.detailId}
                  className="space-y-3 rounded-lg border border-border-default p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-bg-muted text-xs font-semibold text-text-secondary">
                        {index + 1}
                      </span>

                      <p className="text-sm font-semibold text-text-primary">
                        {detail.questionTitle}
                      </p>
                    </div>

                    <p className="shrink-0 text-base font-bold text-text-primary">
                      {detail.score}
                      <span className="text-xs font-normal text-text-secondary">
                        {" "}/ {detail.maxScore}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start gap-2 rounded-md bg-bg-muted p-3">
                    <FiMessageSquare
                      className="mt-0.5 shrink-0 text-text-secondary"
                      size={14}
                    />
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                      {detail.comment?.trim() || "No comment for this question."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  )
}
