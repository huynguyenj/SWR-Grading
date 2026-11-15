
import {
    FiCalendar,
    FiMail,
    FiUser,
} from 'react-icons/fi'

import { formatDate } from '@/utils/format'

import type { AdminUser, UserRole } from '../types/admin_user'

interface AdminUserTableProps {
    users?: AdminUser[]
    loading: boolean
}

const ROLE_CONFIG: Record<
    UserRole,
    { label: string; className: string }
> = {
    0: {
        label: 'Học sinh',
        className: 'bg-purple-500/10 text-purple-600',
    },
    1: {
        label: 'Admin',
        className: 'bg-purple-500/10 text-purple-600',
    },
    2: {
        label: 'Giám khảo',
        className: 'bg-blue-500/10 text-blue-600',
    },
    3: {
        label: 'Khảo thí',
        className: 'bg-emerald-500/10 text-emerald-600',
    },
    4: {
        label: 'Quản lý bộ môn',
        className: 'bg-amber-500/10 text-amber-600',
    },
}

function UserRoleBadge({ role }: { role: UserRole }) {
    const config = ROLE_CONFIG[role]

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                config?.className ?? 'bg-bg-muted text-text-secondary'
            }`}
        >
            {config?.label ?? 'Không xác định'}
        </span>
    )
}

function UserStatusBadge({ isActive }: { isActive: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                isActive
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-danger/10 text-danger'
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-emerald-500' : 'bg-danger'
                }`}
            />

            {isActive ? 'Đang hoạt động' : 'Đã khóa'}
        </span>
    )
}

export default function AdminUserTable({
    users = [],
    loading,
}: AdminUserTableProps) {
    if (loading && users.length === 0) {
        return (
            <div className="flex min-h-60 items-center justify-center rounded-lg border border-border-default bg-bg-primary">
                <div className="flex flex-col items-center gap-3 text-text-secondary">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />

                    <p className="text-sm">
                        Đang tải danh sách người dùng...
                    </p>
                </div>
            </div>
        )
    }

    if (users.length === 0) {
        return (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary px-4 text-center">
                <div className="mb-3 rounded-full bg-bg-muted p-4 text-text-muted">
                    <FiUser size={28} />
                </div>

                <h3 className="font-semibold text-text-primary">
                    Không tìm thấy người dùng
                </h3>

                <p className="mt-1 text-sm text-text-secondary">
                    Không có dữ liệu phù hợp với điều kiện tìm kiếm hiện tại.
                </p>
            </div>
        )
    }

    return (
        <div className="relative overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
            <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead className="bg-bg-muted/50">
                    <tr className="border-b border-border-default">
                        <th className="w-14 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            #
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Người dùng
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Mã nhân viên
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Ngày sinh
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Vai trò
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Trạng thái
                        </th>

                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                            Ngày tạo
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={user.id}
                            className="border-b border-border-default transition-colors last:border-b-0 hover:bg-bg-muted/40"
                        >
                            {/* Index */}
                            <td className="px-4 py-3 text-center text-sm text-text-muted">
                                {index + 1}
                            </td>

                            {/* User Information */}
                            <td className="max-w-[280px] px-4 py-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 rounded-full bg-brand-orange/10 p-2 text-brand-orange">
                                        <FiUser size={17} />
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="truncate text-sm font-medium text-text-primary"
                                            title={user.fullName}
                                        >
                                            {user.fullName}
                                        </p>

                                        <div className="mt-1 flex items-center gap-1.5">
                                            <FiMail
                                                size={12}
                                                className="shrink-0 text-text-muted"
                                            />

                                            <p
                                                className="truncate text-xs text-text-secondary"
                                                title={user.email}
                                            >
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Staff Code */}
                            <td className="px-4 py-3">
                                <span className="whitespace-nowrap text-sm font-medium text-text-primary">
                                    {user.staffCode || '—'}
                                </span>
                            </td>

                            {/* Birthday */}
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <FiCalendar
                                        size={15}
                                        className="shrink-0 text-text-muted"
                                    />

                                    <span className="whitespace-nowrap text-sm text-text-secondary">
                                        {user.birthday
                                            ? formatDate(user.birthday)
                                            : '—'}
                                    </span>
                                </div>
                            </td>

                            {/* Role */}
                            <td className="px-4 py-3">
                                <UserRoleBadge role={user.role} />
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                                <UserStatusBadge
                                    isActive={user.isActive}
                                />
                            </td>

                            {/* Created Date */}
                            <td className="px-4 py-3">
                                <span className="whitespace-nowrap text-sm text-text-secondary">
                                    {user.createdDay
                                        ? formatDate(user.createdDay)
                                        : '—'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Loading Overlay */}
            {loading && users.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50">
                    <div className="flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-4 py-2 text-sm text-text-secondary shadow-sm">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
                        Đang cập nhật dữ liệu...
                    </div>
                </div>
            )}
        </div>
    )
}
