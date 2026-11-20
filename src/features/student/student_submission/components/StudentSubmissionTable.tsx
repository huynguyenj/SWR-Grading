
import {
    FiCalendar,
    FiClock,
    FiFile,
    FiFileText,
    FiLayers,
    FiPlusCircle,
} from 'react-icons/fi'

import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'

import type { StudentSubmission } from '../types/student_submission'
import { SubmissionStatusBadge } from './SubmissionStatusBadge'
import Loading_Circle from '@/components/ui/loading_circle'
import { getSubmissionFileName } from '../utils/file_extracted'

interface StudentSubmissionTableProps {
    submissions?: StudentSubmission[]
    loading: boolean
    onCreateApplication: (submission: StudentSubmission) => void
}

export default function StudentSubmissionTable({
    submissions = [],
    loading,
    onCreateApplication,
}: StudentSubmissionTableProps) {
    if (loading) {
        return <Loading_Circle/>
    }

    if (submissions.length === 0) {
        return (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary px-4 text-center">
                <div className="mb-3 rounded-full bg-bg-muted p-4 text-text-muted">
                    <FiFileText size={28} />
                </div>

                <h3 className="font-semibold text-text-primary">
                   Không có bài nộp nào
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                    Bạn chưa nộp bất kỳ bài nào
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
            <table className="w-full min-w-[1200px] border-collapse text-left">
                <thead className="bg-bg-muted/50">
                    <tr className="border-b border-border-default">
                        <th className="w-14 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            #
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Bài nộp
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Kì thi
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Học kì
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Trạng thái
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Ngày nộp
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Ngày cập nhật
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Thao tác
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {submissions.map((submission, index) => (
                        <tr
                            key={submission.submissionId}
                            className="border-b border-border-default transition-colors last:border-b-0 hover:bg-bg-muted/40"
                        >
                            {/* Index */}
                            <td className="px-4 py-3 text-center text-sm text-text-muted">
                                {index + 1}
                            </td>

                            {/* Submission */}
                            <td className="max-w-[280px] px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 rounded-lg bg-brand-orange/10 p-2 text-brand-orange">
                                        <FiFile size={17} />
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="truncate text-sm font-medium text-text-primary"
                                            title={submission.submissionFile}
                                        >
                                            {getSubmissionFileName(submission.submissionFile)}
                                        </p>

                                        <p
                                            className="mt-1 truncate text-xs text-text-muted"
                                            title={submission.submissionId}
                                        >
                                            ID: {submission.submissionId}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Examination */}
                            <td className="px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiFileText
                                        size={16}
                                        className="mt-0.5 shrink-0 text-text-muted"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-text-primary">
                                            {submission.examination?.name || '—'}
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            {submission.examinationCode || '—'}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Semester */}
                            <td className="px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiLayers
                                        size={16}
                                        className="mt-0.5 shrink-0 text-text-muted"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-text-primary">
                                            {submission.semester?.semesterCode || '—'}
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            {submission.semester?.name || '—'}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                <SubmissionStatusBadge
                                    status={submission.status}
                                />
                            </td>

                            {/* Submitted Date */}
                            <td className="px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiCalendar
                                        size={16}
                                        className="mt-0.5 shrink-0 text-text-muted"
                                    />

                                    <span className="whitespace-nowrap text-sm text-text-primary">
                                        {submission.createdDate
                                            ? formatDate(submission.createdDate)
                                            : '—'}
                                    </span>
                                </div>
                            </td>

                            {/* Updated Date */}
                            <td className="px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiClock
                                        size={16}
                                        className="mt-0.5 shrink-0 text-text-muted"
                                    />

                                    <span className="whitespace-nowrap text-sm text-text-secondary">
                                        {submission.updatedDate
                                            ? formatDate(submission.updatedDate)
                                            : '—'}
                                    </span>
                                </div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                                <div className="flex justify-center">
                                    <Button
                                        type="button"
                                        variant="basic"
                                        onClick={() =>
                                            onCreateApplication(submission)
                                        }
                                        className="inline-flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <FiPlusCircle size={15} />
                                        Tạo đơn phúc khảo
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
