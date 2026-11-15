import type { StudentSubmissionStatus } from "../types/student_submission";

export const submissionStatusConfig: Record<
    StudentSubmissionStatus,
    { label: string; className: string }
> = {
    0: {
        label: 'Submitted',
        className: 'bg-warning/10 text-warning',
    },
    1: {
        label: 'AI Graded',
        className: 'bg-brand-orange/10 text-brand-orange',
    },
    2: {
        label: 'Lecturer Reviewed',
        className: 'bg-brand-wine/10 text-brand-wine',
    },
    3: {
        label: 'Final',
        className: 'bg-success/10 text-success',
    },
}
