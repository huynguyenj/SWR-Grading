import CreateExamSessionModal from '@/features/admin/management/examination/components/CreateExamSessionModal'
import ExamSessionsTable from '@/features/admin/management/examination/components/ExaminationTable'
import type { SortDirection, SortField } from '@/features/admin/management/examination/components/Examinationtoolbar'
import ExamSessionsToolbar from '@/features/admin/management/examination/components/Examinationtoolbar'
import ViewExamSessionModal from '@/features/admin/management/examination/components/ViewExamSessionModal'
import { mockExamSessions, type ExamSession, type ExamSessionStatus } from '@/features/admin/management/examination/types/examination.type'
import { mockSemesters } from '@/features/admin/management/semester/types/semester'
import { useMemo, useState } from 'react'

export default function AdminExamSessionsPage() {
  const [sessions, setSessions] = useState<ExamSession[]>(mockExamSessions)
  const [search, setSearch] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<ExamSessionStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('examDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewingSession, setViewingSession] = useState<ExamSession | null>(null)

  const filteredSessions = useMemo(() => {
    let result = sessions.filter((session) => {
      const matchesSearch = session.name.toLowerCase().includes(search.toLowerCase())
      const matchesSemester = semesterFilter === 'all' || session.semesterId === semesterFilter
      const matchesStatus = statusFilter === 'all' || session.status === statusFilter
      return matchesSearch && matchesSemester && matchesStatus
    })

    result = [...result].sort((a, b) => {
      const comparison =
        sortField === 'examDate'
          ? new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
          : a.name.localeCompare(b.name)

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [sessions, search, semesterFilter, statusFilter, sortField, sortDirection])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Quản lý đợt thi</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Tạo đợt thi dựa trên học kỳ, chỉ định hoặc random đề thi, cấu hình thời gian và quy
          định khi thi.
        </p>
      </div>

      <ExamSessionsToolbar
        search={search}
        onSearchChange={setSearch}
        semesterFilter={semesterFilter}
        onSemesterFilterChange={setSemesterFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortFieldChange={setSortField}
        onToggleSortDirection={() =>
          setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
        }
        semesters={mockSemesters}
        onCreateClick={() => setModalOpen(true)}
      />

      <p className="text-xs text-text-muted">
        Hiển thị {filteredSessions.length} / {sessions.length} đợt thi
      </p>

      <ExamSessionsTable
        sessions={filteredSessions}
        semesters={mockSemesters}
        onView={setViewingSession}
      />

      <CreateExamSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(session) => setSessions((prev) => [session, ...prev])}
        semesters={mockSemesters}
      />

      <ViewExamSessionModal
        session={viewingSession}
        onClose={() => setViewingSession(null)}
        semesters={mockSemesters}
      />
    </div>
  )
}