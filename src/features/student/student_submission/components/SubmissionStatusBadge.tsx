import { submissionStatusConfig } from "../const/student_submission_status"
import type { StudentSubmissionStatus } from "../types/student_submission"

interface SubmissionStatusProps {
    status: StudentSubmissionStatus
}

export function SubmissionStatusBadge({ status }: SubmissionStatusProps) {
    const config = submissionStatusConfig[status]

    if (!config) {
        return (
            <span className="inline-flex whitespace-nowrap rounded-full bg-bg-muted px-3 py-1 text-xs font-medium text-text-secondary">
                Unknown
            </span>
        )
    }

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    )
}