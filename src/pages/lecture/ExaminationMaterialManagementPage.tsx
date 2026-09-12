import type { UploadedFile } from '@/components/ui/FileUploadZone'
import { mockSemesters, type Semester, type SemesterStatus } from '@/features/admin/management/semester/types/semester'
import LecturerSemestersTable from '@/features/lecturer/examination_materials/components/LecturerSemesterTable'
import type { SortDirection, SortField } from '@/features/lecturer/examination_materials/components/LecturerSemestertoolbar'
import LecturerSemestersToolbar from '@/features/lecturer/examination_materials/components/LecturerSemestertoolbar'
import UploadDocumentsModal from '@/features/lecturer/examination_materials/components/UploadDocumentModal'
import ViewExamMaterialDetailModal from '@/features/lecturer/examination_materials/components/ViewExamMaterialDetail'
import { useMemo, useState } from 'react'


export default function LecturerSemestersPage() {
  const semesters = mockSemesters

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SemesterStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null)
  // Lưu file đã upload theo từng học kỳ (key = semester.id) để khi mở lại vẫn còn
  const [filesBySemester, setFilesBySemester] = useState<Record<string, UploadedFile[]>>({})
  const [selectedDetail, setSelectedDetail] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const filteredSemesters = useMemo(() => {
    let result = semesters.filter((semester) => {
      const query = search.toLowerCase()
      const matchesSearch =
        semester.name.toLowerCase().includes(query) ||
        semester.code.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || semester.status === statusFilter
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
  }, [semesters, search, statusFilter, sortField, sortDirection])

  const currentFiles = selectedSemester ? filesBySemester[selectedSemester.id] ?? [] : []

  function handleFilesAdded(newFiles: UploadedFile[]) {
    if (!selectedSemester) return
    setFilesBySemester((prev) => ({
      ...prev,
      [selectedSemester.id]: [...(prev[selectedSemester.id] ?? []), ...newFiles],
    }))
  }

  function handleRemoveFile(id: string) {
    if (!selectedSemester) return
    setFilesBySemester((prev) => ({
      ...prev,
      [selectedSemester.id]: (prev[selectedSemester.id] ?? []).filter((f) => f.id !== id),
    }))
  }
  function handleOpenDetail (semester: Semester) {
    setSelectedSemester(semester)
    setSelectedDetail(true)
  }
  function handleCloseDetail () {
    setSelectedSemester(null)
    setSelectedDetail(false)
  }
  function handleOpenUpload (semester: Semester) {
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

      <p className="text-xs text-text-muted">
        Hiển thị {filteredSemesters.length} / {semesters.length} học kỳ
      </p>

      <LecturerSemestersTable
        semesters={filteredSemesters}
        onOpenUpload={handleOpenUpload}
        onOpenDetail={handleOpenDetail}
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