import { useState } from 'react'
import {
    FiCalendar,
    FiClock,
    FiEye,
    FiFile,
    FiFileText,
    FiLayers,
    FiPlusCircle,
} from 'react-icons/fi'

import Button from '@/components/ui/button'


import type { StudentSubmission } from '@/features/student/student_submission/types/student_submission'

import ViewGradingHistoryModal from '@/features/student/student_submission/components/ViewGradingHistoryModal'
import Loading_Circle from '@/components/ui/loading_circle'
import { getSubmissionFileName } from '../utils/file_extracted'
import { SubmissionStatusBadge } from './SubmissionStatusBadge'
import { formatDate } from '@/utils/format'


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
    const [selectedSubmission, setSelectedSubmission] =
        useState<StudentSubmission | null>(null)

    const handleViewGradingHistory = (
        submission: StudentSubmission,
    ) => {
        setSelectedSubmission(submission)
    }

    const handleCloseGradingHistory = () => {
        setSelectedSubmission(null)
    }

    if (loading) {
        return <Loading_Circle />
    }

    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border-default bg-bg-primary px-6 py-12 text-center">
                <FiFileText
                    size={40}
                    className="mb-3 text-text-tertiary"
                />

                <h3 className="text-base font-semibold text-text-primary">
                    Chưa có bài nộp
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                    Bạn chưa có bài nộp nào trong danh sách.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-border-default bg-bg-primary">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-sm">
                        <thead className="bg-bg-secondary">
                            <tr className="border-b border-border-default">
                                <th className="px-4 py-3 text-center font-semibold text-text-primary">
                                    #
                                </th>

                                <th className="px-4 py-3 text-left font-semibold text-text-primary">
                                    Bài nộp
                                </th>

                                <th className="px-4 py-3 text-left font-semibold text-text-primary">
                                    Kì thi
                                </th>

                                <th className="px-4 py-3 text-left font-semibold text-text-primary">
                                    Học kì
                                </th>

                                <th className="px-4 py-3 text-center font-semibold text-text-primary">
                                    Trạng thái
                                </th>

                                <th className="px-4 py-3 text-left font-semibold text-text-primary">
                                    Ngày nộp
                                </th>

                                <th className="px-4 py-3 text-left font-semibold text-text-primary">
                                    Ngày cập nhật
                                </th>

                                <th className="px-4 py-3 text-center font-semibold text-text-primary">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {submissions.map(
                                (submission, index) => (
                                    <tr
                                        key={submission.submissionId}
                                        className="border-b border-border-default last:border-b-0 transition-colors hover:bg-bg-secondary/50"
                                    >
                                        {/* Index */}
                                        <td className="px-4 py-3 text-center text-text-secondary">
                                            {index + 1}
                                        </td>

                                        {/* Submission file */}
                                        <td className="px-4 py-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                                                    <FiFile
                                                        size={18}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p
                                                        className="max-w-[280px] truncate font-medium text-text-primary"
                                                        title={getSubmissionFileName(
                                                            submission.submissionFile,
                                                        )}
                                                    >
                                                        {getSubmissionFileName(
                                                            submission.submissionFile,
                                                        )}
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                                                        <FiLayers
                                                            size={12}
                                                        />
                                                        {submission.studentCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Examination */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-2">
                                                <FiFileText
                                                    size={15}
                                                    className="mt-0.5 shrink-0 text-text-tertiary"
                                                />

                                                <div>
                                                    <p className="font-medium text-text-primary">
                                                        {submission.examination?.name
                                                            || 'Không có thông tin'}
                                                    </p>

                                                    <p className="mt-1 text-xs text-text-secondary">
                                                        {submission.examinationCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Semester */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-2">
                                                <FiCalendar
                                                    size={15}
                                                    className="mt-0.5 shrink-0 text-text-tertiary"
                                                />

                                                <div>
                                                    <p className="font-medium text-text-primary">
                                                        {submission.semester?.semesterCode
                                                            || 'N/A'}
                                                    </p>

                                                    <p className="mt-1 text-xs text-text-secondary">
                                                        {submission.semester?.name
                                                            || 'Không có thông tin'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3 text-center">
                                            <SubmissionStatusBadge
                                                status={submission.status}
                                            />
                                        </td>

                                        {/* Created date */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 whitespace-nowrap text-text-secondary">
                                                <FiClock
                                                    size={14}
                                                />

                                                {formatDate(
                                                    submission.createdDate,
                                                )}
                                            </div>
                                        </td>

                                        {/* Updated date */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 whitespace-nowrap text-text-secondary">
                                                <FiClock
                                                    size={14}
                                                />

                                                {formatDate(
                                                    submission.updatedDate,
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* View grading history */}
                                                <Button
                                                    type="button"
                                                    variant="basic"
                                                    onClick={() =>
                                                        handleViewGradingHistory(
                                                            submission,
                                                        )
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center p-0"
                                                    title="Xem lịch sử chấm"
                                                >
                                                    <FiEye
                                                        size={16}
                                                    />
                                                </Button>

                                                {/* Create application */}
                                                <Button
                                                    type="button"
                                                    variant="basic"
                                                    onClick={() =>
                                                        onCreateApplication(
                                                            submission,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    <FiPlusCircle
                                                        size={15}
                                                    />
                                                    Tạo đơn phúc khảo
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grading history modal */}
            <ViewGradingHistoryModal
                submission={selectedSubmission}
                onClose={handleCloseGradingHistory}
            />
        </>
    )
}