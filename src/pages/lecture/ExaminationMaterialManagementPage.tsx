import type { UploadedFile } from '@/components/ui/FileUploadZone'
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
  // Lưu file đã upload theo từng học kỳ (key = semester.id) để khi mở lại vẫn còn
  const [filesBySemester, setFilesBySemester] = useState<Record<string, UploadedFile[]>>({})
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

  const currentFiles = selectedSemester ? filesBySemester[selectedSemester.semesterId] ?? [] : []

  function handleFilesAdded(newFiles: UploadedFile[]) {
    if (!selectedSemester) return
    setFilesBySemester((prev) => ({
      ...prev,
      [selectedSemester.semesterId]: [...(prev[selectedSemester.semesterId] ?? []), ...newFiles],
    }))
  }

  function handleRemoveFile(id: string) {
    if (!selectedSemester) return
    setFilesBySemester((prev) => ({
      ...prev,
      [selectedSemester.semesterId]: (prev[selectedSemester.semesterId] ?? []).filter((f) => f.id !== id),
    }))
  }
  function handleOpenDetail (semester: SemesterType) {
    setSelectedSemester(semester)
    setSelectedDetail(true)
  }
  function handleCloseDetail () {
    setSelectedSemester(null)
    setSelectedDetail(false)
  }
  function handleOpenUpload (semester: SemesterType) {
    setSelectedSemester(semester)
    setUploadOpen(true)
  }
  function handleCloseUpload () {
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

      {/* <p className="text-xs text-text-muted">
        Hiển thị {filteredSemesters.length} / {semesters.length} học kỳ
      </p> */}

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
      
      <UploadDocumentsModal
        semester={selectedSemester}
        onClose={handleCloseUpload}
        isOpen={uploadOpen}
        files={currentFiles}
        onFilesAdded={handleFilesAdded}
        onRemoveFile={handleRemoveFile}
      />

      <ViewExamMaterialDetailModal
        semester={selectedSemester}
        onOpen={selectedDetail}
        onClose={handleCloseDetail}
        files={currentFiles}
        onFilesAdded={handleFilesAdded}
        onRemoveFile={handleRemoveFile}
      />
    </div>
  )
}