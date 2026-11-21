import type { StudentSubmissionStatus } from "../types/student_submission";

export const submissionStatusConfig: Record<
    StudentSubmissionStatus,
    { label: string; className: string }
> = {
    0: {
        label: 'Đã nộp',
        className: 'bg-warning/10 text-warning',
    },
    1:{
    
        label: 'Đang chấm',
        className: 'bg-brand-orange/10 text-brand-orange',
    },
    2: {
        label: 'AI chấm',
        className: 'bg-brand-orange/10 text-brand-orange',
    },
    3: {
        label: 'Giảng viên đã xem',
        className: 'bg-brand-wine/10 text-brand-wine',
    },
    4: {
        label: 'Bảng cuối',
        className: 'bg-success/10 text-success',
    },
}
