
import { useState } from 'react'
import { FiRefreshCw, FiSearch } from 'react-icons/fi'

import Pagination from '@/components/ui/pagination'

import LecturerTable from '@/features/admin/management/lecturer/components/LecturerTable'
import UpdateLecturerModal from '@/features/admin/management/lecturer/components/UpdateLecturerModal'

import useGetLecturerList from '@/features/admin/management/lecturer/hooks/useGetLecturerList'

import type { LecturerType } from '@/features/admin/management/lecturer/types/lecturer.type'
import Input from '@/components/ui/input'

export default function AdminUserPage() {
  const {
    lecturerDataList,
    loading,
    search,
    setSearch,
    currentLecturerPage,
    pageLecturerSize,
    setCurrentLecturerPage,
    setPageLecturerSize,
    refresh,
  } = useGetLecturerList()

  const [editLecturer, setEditLecturer] = useState<LecturerType | null>(null)

  const handleEditLecturer = (lecturer: LecturerType) => {
    setEditLecturer(lecturer)
  }

  const handleCloseUpdateModal = () => {
    setEditLecturer(null)
  }

  const handleRefresh = () => {
    refresh()
  }


  return (
    <div className="space-y-5">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Quản lý giảng viên
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Quản lý thông tin và theo dõi hoạt động của giảng viên trong hệ thống.
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* SEARCH */}
        <div className="relative w-full sm:max-w-sm">
          <Input
            type="text"
            icon={FiSearch}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setCurrentLecturerPage(1)
            }}
            placeholder="Tìm kiếm giảng viên..."
          />
        </div>

        {/* REFRESH */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border-default bg-bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiRefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Làm mới
        </button>
      </div>

      {/* TABLE INFORMATION */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-text-muted">
          Hiển thị{' '}
          <span className="font-medium text-text-primary">
            {lecturerDataList?.items.length ?? 0}
          </span>{' '}
          giảng viên ở trang này (tổng{' '}
          <span className="font-medium text-text-primary">
            {lecturerDataList?.totalCount ?? 0}
          </span>
          )
        </p>
      </div>

      {/* LECTURER TABLE */}
      <div
        className={
          loading
            ? 'pointer-events-none opacity-60 transition-opacity'
            : 'transition-opacity'
        }
      >
        {loading && !lecturerDataList ? (
          <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
            <p className="text-sm text-text-secondary">
              Đang tải danh sách giảng viên...
            </p>
          </div>
        ) : (
          <LecturerTable
            lecturers={lecturerDataList?.items ?? []}
            onEdit={handleEditLecturer}
          />
        )}
      </div>

      {/* PAGINATION */}
      {lecturerDataList && lecturerDataList.totalPages > 0 && (
        <Pagination
          currentPage={currentLecturerPage}
          onPageChange={setCurrentLecturerPage}
          totalPages={lecturerDataList.totalPages}
          onPageSizeChange={(size) => {
            setPageLecturerSize(size)
            setCurrentLecturerPage(1)
          }}
          pageSize={pageLecturerSize}
        />
      )}

      {/* UPDATE LECTURER MODAL */}
      <UpdateLecturerModal
        lecturer={editLecturer}
        onClose={handleCloseUpdateModal}
        onRefresh={refresh}
      />
    </div>
  )
}
