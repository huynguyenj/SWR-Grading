
import { FiLayers, FiCalendar } from 'react-icons/fi'



import { formatDate } from '@/utils/format'
import type { ApplicationType } from '../types/application_type'
import { applicationStatusConfig } from '../const/application_status'

interface StudentApplicationTableProps {
    applications?: ApplicationType[]
    loading?: boolean
}


export default function StudentApplicationTable({
    applications,
    loading = false,
}: StudentApplicationTableProps) {
    if (loading) {
        return (
            <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
                <p className="text-sm text-text-muted">
                    Đang tải danh sách đơn đăng ký...
                </p>
            </div>
        )
    }

    if (!applications?.length) {
        return (
            <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
                <FiLayers className="mx-auto mb-3 h-8 w-8 text-text-muted" />

                <p className="text-sm font-medium text-text-primary">
                    Chưa có đơn đăng ký nào
                </p>

                <p className="mt-1 text-xs text-text-muted">
                    Danh sách đơn đăng ký sẽ được hiển thị tại đây.
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
                            Lý do đăng ký
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Trạng thái
                        </th>

                        <th className="px-4 py-3 font-medium text-text-secondary">
                            Ngày tạo
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {applications.map((application, index) => {
                        const statusConfig =
                            applicationStatusConfig[application.status]

                        return (
                            <tr
                                key={`${application.createDate}-${index}`}
                                className="border-b border-border-default transition-colors last:border-0 hover:bg-bg-muted/40"
                            >
                                {/* Index */}
                                <td className="px-4 py-3 text-text-muted">
                                    {index + 1}
                                </td>

                                {/* Reason */}
                                <td className="max-w-lg px-4 py-3">
                                    <p className="font-medium text-text-primary">
                                        {application.reason || 'Không có lý do'}
                                    </p>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    {statusConfig ? (
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.className}`}
                                        >
                                            {statusConfig.label}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-text-muted">
                                            Không xác định
                                        </span>
                                    )}
                                </td>

                                {/* Created date */}
                                <td className="whitespace-nowrap px-4 py-3">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <FiCalendar className="h-3.5 w-3.5 shrink-0 text-text-muted" />

                                        <span>
                                            {application.createDate
                                                ? formatDate(application.createDate)
                                                : 'Chưa xác định'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
