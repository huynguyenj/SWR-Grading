
import {
    FiCalendar,
    FiClock,
    FiFileText,
    FiLayers,
    FiUsers,
} from 'react-icons/fi'

import { SESSION_STATUS_CLASS, SESSION_STATUS_LABEL, type ExaminationSessionType } from '@/features/examiner/management/examination/types/exam_session'
import { formatDate } from '@/utils/format'

interface StudentExamSessionTableProps {
    examinationSessions?: ExaminationSessionType[]
    loading: boolean
}

export default function StudentExamSessionTable({
    examinationSessions,
    loading,
}: StudentExamSessionTableProps) {
    if (loading) {
        return (
            <div className="flex min-h-60 items-center justify-center rounded-lg border border-border-default bg-bg-primary">
                <div className="flex flex-col items-center gap-3 text-text-secondary">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
                    <p className="text-sm">Loading...</p>
                </div>
            </div>
        )
    }

    if (!examinationSessions?.length) {
        return (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary px-4 text-center">
                <div className="mb-3 rounded-full bg-bg-muted p-4 text-text-muted">
                    <FiFileText size={28} />
                </div>

                <h3 className="font-semibold text-text-primary">
                    Không có kết quả tìm kiếm
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                    Bạn hiện tại chưa tham gia đợt thi nào
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
            <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead className="bg-bg-muted/50">
                    <tr className="border-b border-border-default">
                        <th className="w-14 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            #
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Kì thi
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Học kì
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Ngày bắt đầu
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Ngày kết thúc
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Bài làm
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Trạng thái
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Ngày cập nhật
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {examinationSessions.map((session, index) => (
                        <tr
                            key={session.examinationSessionId}
                            className="border-b border-border-default transition-colors last:border-b-0 hover:bg-bg-muted/40"
                        >
                            {/* Index */}
                            <td className="px-4 py-3 text-center text-sm text-text-muted">
                                {index + 1}
                            </td>

                            {/* Examination */}
                            <td className="px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 rounded-lg bg-brand-orange/10 p-2 text-brand-orange">
                                        <FiFileText size={17} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-medium text-text-primary">
                                            {session.examination?.name || 'Unnamed examination'}
                                        </p>

                                        <p className="mt-1 text-xs text-text-muted">
                                            {session.examinationCode || '—'}
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
                                            {session.semester?.semesterCode || '—'}
                                        </p>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            {session.semester?.name || '—'}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Start Date */}
                            <td className="px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiCalendar
                                        size={16}
                                        className="mt-0.5 shrink-0 text-text-muted"
                                    />

                                    <div>
                                        <p className="text-sm text-text-primary">
                                            {session.startDate
                                                ? formatDate(session.startDate)
                                                : '—'}
                                        </p>

                                        <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                                            <FiClock size={12} />
                                            {session.startTime || '—'}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* End Date */}
                            <td className="px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiCalendar
                                        size={16}
                                        className="mt-0.5 shrink-0 text-text-muted"
                                    />

                                    <span className="text-sm text-text-primary">
                                        {session.examination?.endDate
                                            ? formatDate(session.examination.endDate)
                                            : '—'}
                                    </span>
                                </div>
                            </td>

                            {/* Total Submission */}
                            <td className="px-4 py-3 text-center">
                                <div className="inline-flex items-center gap-2 rounded-lg bg-bg-muted px-3 py-1.5">
                                    <FiUsers size={15} className="text-text-secondary" />

                                    <span className="text-sm font-medium text-text-primary">
                                        {session.totalSubmission}
                                    </span>
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                    <span
                                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                          SESSION_STATUS_CLASS[session.status]
                                          }`}
                                    >
                                          {SESSION_STATUS_LABEL[session.status]}
                                    </span>
                            </td>

                            {/* Updated Date */}
                            <td className="px-4 py-3">
                                <p className="text-sm text-text-secondary">
                                    {session.updatedDay
                                        ? formatDate(session.updatedDay)
                                        : '—'}
                                </p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
