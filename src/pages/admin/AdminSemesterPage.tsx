import CreateSemesterModal from '@/features/admin/management/semester/components/CreateSemesterModal'
import SemestersTable from '@/features/admin/management/semester/components/SemesterTable'
import type { SortDirection, SortField } from '@/features/admin/management/semester/components/Semestertoolbar'
import SemestersToolbar from '@/features/admin/management/semester/components/Semestertoolbar'
import { mockSemesters, type Semester, type SemesterStatus } from '@/features/admin/management/semester/types/semester'
import { useMemo, useState } from 'react'

export default function AdminSemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>(mockSemesters)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SemesterStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [modalOpen, setModalOpen] = useState(false)

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
        Hiển thị {filteredSemesters.length} / {semesters.length} học kỳ
      </p>

      <SemestersTable semesters={filteredSemesters} />

      <CreateSemesterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(semester) => setSemesters((prev) => [semester, ...prev])}
      />
    </div>
  )
}