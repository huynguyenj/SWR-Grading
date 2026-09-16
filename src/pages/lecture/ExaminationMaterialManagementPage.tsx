import Pagination from '@/components/ui/pagination'
import useGetSemester from '@/features/admin/management/semester/hooks/useGetSemester'
import type { SemesterStatus, SemesterType } from '@/features/admin/management/semester/types/semester'
import LecturerSemestersTable from '@/features/lecturer/examination_materials/components/LecturerSemesterTable'
import type { SortDirection, SortField } from '@/features/lecturer/examination_materials/components/LecturerSemestertoolbar'
import LecturerSemestersToolbar from '@/features/lecturer/examination_materials/components/LecturerSemestertoolbar'
import UploadDocumentsModal from '@/features/lecturer/examination_materials/components/UploadDocumentModal'
import ViewExamMaterialDetailModal from '@/features/lecturer/examination_materials/components/ViewExamMaterialDetail'
import { useMemo, useState } from 'react'

export default function LecturerSemestersPage() {
  const { currentSemesterPage, pageSemesterSize, semesterDataList, setCurrentSemesterPage, setPageSemesterSize } = useGetSemester()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SemesterStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(null)
  // Danh sách file này chỉ còn phục vụ ViewExamMaterialDetailModal (xem chi tiết tài liệu
  // đã upload của 1 học kỳ). UploadDocumentsModal giờ tự quản lý form/file qua
  // useUploadExamMaterial, không cần state này nữa.
  const [selectedDetail, setSelectedDetail] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const filteredSemesters = useMemo(() => {
    let result = semesterDataList?.items.filter((semester) => {
      const query = search.toLowerCase()
      const matchesSearch =
        semester.name.toLowerCase().includes(query) ||
        semester.semesterCode.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || semester.status == statusFilter
      return matchesSearch && matchesStatus
    })

    result = [...(result ?? [])].sort((a, b) => {
      const comparison =
        sortField === 'startDate'
          ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          : a.name.localeCompare(b.name)
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [semesterDataList, search, statusFilter, sortField, sortDirection])


  function handleOpenDetail(semester: SemesterType) {
    setSelectedSemester(semester)
    setSelectedDetail(true)
  }
  function handleCloseDetail() {
    setSelectedSemester(null)
    setSelectedDetail(false)
  }
  function handleOpenUpload(semester: SemesterType) {
    setSelectedSemester(semester)
    setUploadOpen(true)
  }
  function handleCloseUpload() {
    setSelectedSemester(null)
    setUploadOpen(false)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Học kỳ</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Xem danh sách học kỳ và tải tài liệu giảng dạy lên từng học kỳ.
        </p>
      </div>

      <LecturerSemestersToolbar
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
      />

      <LecturerSemestersTable
        semesters={filteredSemesters}
        onOpenUpload={handleOpenUpload}
        onOpenDetail={handleOpenDetail}
      />

      <Pagination
        currentPage={currentSemesterPage}
        onPageChange={setCurrentSemesterPage}
        totalPages={semesterDataList?.totalPages}
        onPageSizeChange={setPageSemesterSize}
        pageSize={pageSemesterSize}
      />

      {/* Form tạo tài liệu thi giờ tự quản lý state qua useUploadExamMaterial,
          page chỉ cần biết đang mở cho học kỳ nào và đóng/mở modal */}
      <UploadDocumentsModal
        semester={selectedSemester}
        isOpen={uploadOpen}
        onClose={handleCloseUpload}
      />

      <ViewExamMaterialDetailModal
        semester={selectedSemester}
        onOpen={selectedDetail}
        onClose={handleCloseDetail}
      />
    </div>
  )
}