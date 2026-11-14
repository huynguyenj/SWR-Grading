
import {
    FiLayers,
    FiCalendar,
    FiClock,
    FiFileText,
    FiUser,
} from 'react-icons/fi'

import { formatDate } from '@/utils/format'
import type { ApplicationType } from '@/features/student/application/types/application_type'

import ApplicationStatusCell from './ApplicationStatusCell'

interface ManagerApplicationTableProps {
    applications?: ApplicationType[]
    loading?: boolean
    onRefresh: () => void
}

export default function ManagerApplicationTable({
    applications,
    loading = false,
    onRefresh,
}: ManagerApplicationTableProps) {
    // Loading state
    if (loading) {
        return (
            <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
                <p className="text-sm text-text-muted">
                    Đang tải danh sách đơn phúc khảo...
                </p>
            </div>
        )
    }

    // Empty state
    if (!applications?.length) {
        return (
            <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
                <FiLayers className="mx-auto mb-3 h-8 w-8 text-text-muted" />

                <p className="text-sm font-medium text-text-primary">
                    Chưa có đơn phúc khảo nào
                </p>

                <p className="mt-1 text-xs text-text-muted">
                    Danh sách đơn phúc khảo sẽ được hiển thị tại đây.
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border-default bg-bg-muted/50 text-left">
                        <th className="px-4 py-3 font-medium text-text-secondary">
                            #
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Sinh viên
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Kỳ thi
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Lý do phúc khảo
                        </th>

                        <th className="px-4 py-3 text-center font-medium text-text-secondary">
                            Điểm chính thức
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Trạng thái
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Ngày gửi
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Cập nhật lần cuối
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {applications.map((application, index) => (
                        <tr
                            key={application.id}
                            className="border-b border-border-default transition-colors last:border-0 hover:bg-bg-muted/40"
                        >
                            {/* Index */}
                            <td className="px-4 py-3 text-text-muted">
                                {index + 1}
                            </td>

                            {/* Student */}
                            <td className="min-w-44 px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiUser className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                                    <div className="min-w-0">
                                        <p className="font-medium text-text-primary">
                                            {application.studentName}
                                        </p>

                                        <p className="text-xs text-text-muted">
                                            {application.studentCode}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Examination */}
                            <td className="max-w-xs px-4 py-3">
                                <div className="flex items-start gap-2">
                                    <FiFileText className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                                    <div className="min-w-0">
                                        <p className="font-medium text-text-primary">
                                            {application.examinationName}
                                        </p>

                                        <p className="mt-0.5 text-xs text-text-muted">
                                            {application.examinationSessionCode}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Reason */}
                            <td className="max-w-md px-4 py-3">
                                <p
                                    className="line-clamp-3 text-text-secondary"
                                    title={application.reason}
                                >
                                    {application.reason || 'Không có lý do'}
                                </p>
                            </td>

                            {/* Official score */}
                            <td className="px-4 py-3 text-center">
                                <span className="font-semibold text-text-primary">
                                    {application.officialScore ?? '--'}
                                </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                <ApplicationStatusCell
                                    applicationId={application.id}
                                    status={application.status}
                                    onRefresh={onRefresh}
                                />
                            </td>

                            {/* Created date */}
                            <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <FiCalendar className="h-3.5 w-3.5 shrink-0 text-text-muted" />

                                    <span>
                                        {application.createdDay
                                            ? formatDate(application.createdDay)
                                            : 'Chưa xác định'}
                                    </span>
                                </div>
                            </td>

                            {/* Updated date */}
                            <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <FiClock className="h-3.5 w-3.5 shrink-0 text-text-muted" />

                                    <span>
                                        {application.updatedDay
                                            ? formatDate(application.updatedDay)
                                            : 'Chưa xác định'}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
