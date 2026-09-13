import Pagination from '@/components/ui/pagination'
import ConfirmDeleteSemesterModal from '@/features/admin/management/semester/components/ConfirmModal'
import CreateSemesterModal from '@/features/admin/management/semester/components/CreateSemesterModal'
import SemestersTable from '@/features/admin/management/semester/components/SemesterTable'
import type { SortDirection, SortField } from '@/features/admin/management/semester/components/Semestertoolbar'
import SemestersToolbar from '@/features/admin/management/semester/components/Semestertoolbar'
import UpdateSemesterModal from '@/features/admin/management/semester/components/UpdateSemesterModal'
import useGetSemester from '@/features/admin/management/semester/hooks/useGetSemester'
import { type SemesterType, type SemesterStatus } from '@/features/admin/management/semester/types/semester'
import { useMemo, useState } from 'react'

export default function AdminSemestersPage() {
  const { semesterDataList, currentSemesterPage, pageSemesterSize, setCurrentSemesterPage, setPageSemesterSize, refresh } = useGetSemester()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SemesterStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const filteredSemesters = useMemo(() => {
    if (!semesterDataList) return
    let result = semesterDataList.items.filter((semester) => {
      const query = search.toLowerCase()
      const matchesSearch =
        semester.name.toLowerCase().includes(query) ||
        semester.semesterCode.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || semester.status == statusFilter
      return matchesSearch && matchesStatus
    })

    result = [...result].sort((a, b) => {
      const comparison =
        sortField === 'startDate'
          ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          : a.name.localeCompare(b.name)
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [semesterDataList, search, statusFilter, sortField, sortDirection])
  const handleOpenModalUpdate = (semester: SemesterType) => {
    setUpdateModalOpen(true)
    setSelectedSemester(semester)
  }
  const handleDeleteModalUpdate = (semester: SemesterType) => {
    setDeleteModalOpen(true)
    setSelectedSemester(semester)
  }
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Quản lý học kỳ</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Tạo mới và theo dõi các học kỳ cùng số môn học, kỳ thi trực thuộc.
        </p>
      </div>

      <SemestersToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortFieldChange={setSortField}
        onToggleSortDirection={() =>
          setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
        }
        onCreateClick={() => setModalOpen(true)}
      />

      <p className="text-xs text-text-muted">
        {/* Hiển thị {semesterDataList? semesterDataList.item.length : 0} / {semesterDataList? semesterDataList.totalCount : 0} học kỳ */}
      </p>

      <SemestersTable semesters={filteredSemesters} onSelected={handleOpenModalUpdate} onDeleted={handleDeleteModalUpdate}/>
      <Pagination
        currentPage={currentSemesterPage}
        onPageChange={setCurrentSemesterPage}
        totalPages={semesterDataList?.totalPages}
        onPageSizeChange={setPageSemesterSize}
        pageSize={pageSemesterSize}
      />
      <CreateSemesterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRefresh={refresh}
      />
      <UpdateSemesterModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        semester={selectedSemester}
        onRefresh={refresh}
      />
      <ConfirmDeleteSemesterModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        semester={selectedSemester}
        onRefresh={refresh}
      />
    </div>
  )
}