import { useMemo, useState } from 'react'
import { FiUsers, FiUserPlus } from 'react-icons/fi'

import Button from '@/components/ui/button'

import Pagination from '@/components/ui/pagination'

import useGetAdminUsers from '@/features/admin/management/user/hooks/useGetAdminUsers'

import AdminUsersToolbar from '@/features/admin/management/user/components/AdminUsersToolbar'
import AdminUserTable from '@/features/admin/management/user/components/AdminUserTable'
import CreateAdminUserModal from '@/features/admin/management/user/components/CreateAdminUserModal'

export default function AdminUserManagementPage() {
    const {
        adminUserDataList,
        loading,
        currentUserPage,
        pageUserSize,
        setCurrentUserPage,
        setPageUserSize,
        search,
        setSearch,
        role,
        setRole,
        refresh,
    } = useGetAdminUsers()

    const [createModalOpen, setCreateModalOpen] = useState(false)

    const users = adminUserDataList?.items ?? []

    const handlePageSizeChange = (size: number) => {
        setPageUserSize(size)
        setCurrentUserPage(1)
    }

    const statistics = useMemo(() => {
        const totalUsers = adminUserDataList?.totalCount ?? 0

        const activeUsers = users.filter((user) => user.isActive).length
        const inactiveUsers = users.filter((user) => !user.isActive).length

        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
        }
    }, [adminUserDataList?.totalCount, users])

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <FiUsers className="h-6 w-6 text-brand-orange" />

                        <h1 className="text-2xl font-semibold text-text-primary">
                            Quản lý người dùng
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-text-secondary">
                        Quản lý tài khoản người dùng trong hệ thống.
                    </p>
                </div>

                {/* Create User Button */}
                <Button
                    variant="default"
                    size="basic"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <FiUserPlus className="h-4 w-4" />
                    Tạo tài khoản
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border-default bg-bg-primary p-4">
                    <p className="text-sm text-text-secondary">
                        Tổng người dùng
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-text-primary">
                        {statistics.totalUsers}
                    </p>
                </div>

                <div className="rounded-lg border border-border-default bg-bg-primary p-4">
                    <p className="text-sm text-text-secondary">
                        Đang hoạt động
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-emerald-600">
                        {statistics.activeUsers}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                        Trong trang hiện tại
                    </p>
                </div>

                <div className="rounded-lg border border-border-default bg-bg-primary p-4">
                    <p className="text-sm text-text-secondary">
                        Đã khóa
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-danger">
                        {statistics.inactiveUsers}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                        Trong trang hiện tại
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <AdminUsersToolbar
                search={search}
                onSearchChange={setSearch}
                role={role}
                onRoleChange={setRole}
                onRefresh={refresh}
                loading={loading}
            />

            {/* User Table */}
            <AdminUserTable
                users={users}
                loading={loading}
            />

            {/* Pagination */}
            {adminUserDataList && adminUserDataList.totalPages > 0 && (
                <Pagination
                    currentPage={currentUserPage}
                    onPageChange={setCurrentUserPage}
                    totalPages={adminUserDataList.totalPages}
                    pageSize={pageUserSize}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            {/* Create User Modal */}
            <CreateAdminUserModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onRefresh={refresh}
            />
        </div>
    )
}