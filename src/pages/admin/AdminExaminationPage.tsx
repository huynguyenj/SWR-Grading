import Pagination from '@/components/ui/pagination'
import ConfirmDeleteExamModal from '@/features/admin/management/examination/components/ConfirmDeleteExamModal'
import CreateExamSessionModal from '@/features/admin/management/examination/components/CreateExamSessionModal'
import ExamSessionsTable from '@/features/admin/management/examination/components/ExaminationTable'
import type { SortDirection, SortField } from '@/features/admin/management/examination/components/Examinationtoolbar'
import ExamSessionsToolbar from '@/features/admin/management/examination/components/Examinationtoolbar'
import UpdateExamSessionModal from '@/features/admin/management/examination/components/UpdateExamSessionModal'
import ViewExamSessionModal from '@/features/admin/management/examination/components/ViewExamSessionModal'
import useGetExaminationList from '@/features/admin/management/examination/hooks/useGetExaminationList'
import type { ExaminationStatus, ExaminationType } from '@/features/admin/management/examination/types/examination.type'
import useGetSemester from '@/features/admin/management/semester/hooks/useGetSemester'
import { useMemo, useState } from 'react'

export default function AdminExamSessionsPage() {
  const { semesterDataList } = useGetSemester()
  const {
    examinationDataList,
    loading,
    currentExaminationPage,
    pageExaminationSize,
    setCurrentExaminationPage,
    setPageExaminationSize,
    refresh,
  } = useGetExaminationList()

  const [search, setSearch] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<ExaminationStatus | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewExamSession, setViewExamSession] = useState<ExaminationType | null>(null)
  const [editExamSession, setEditExamSession] = useState<ExaminationType | null>(null)
  const [deleteExamSession, setDeleteExamSession] = useState<ExaminationType | null>(null)
  const filteredSessions = useMemo(() => {
    const sessions = examinationDataList?.items ?? []

    let result = sessions.filter((session) => {
      const query = search.toLowerCase()
      const matchesSearch =
        session.name.toLowerCase().includes(query) ||
        session.examinationCode.toLowerCase().includes(query)
      const matchesSemester = semesterFilter === 'all' || session.semesterId === semesterFilter
      // So sánh dạng chuỗi để chạy đúng dù toolbar trả về '1' hay 1
      const matchesStatus =
        statusFilter === 'all' || String(session.status) === String(statusFilter)
      return matchesSearch && matchesSemester && matchesStatus
    })

    result = [...result].sort((a, b) => {
      const comparison =
        sortField !== 'name'
          ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          : a.name.localeCompare(b.name)

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [examinationDataList, search, semesterFilter, statusFilter, sortField, sortDirection])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Quản lý đợt thi</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Tạo đợt thi theo học kỳ, chọn bộ đề và cấu hình thời gian tổ chức.
        </p>
      </div>

      {semesterDataList?.items ? (
        <>
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
            semesters={semesterDataList.items}
            onCreateClick={() => setModalOpen(true)}
          />

          <p className="text-xs text-text-muted">
            Hiển thị {filteredSessions.length} đợt thi ở trang này (tổng{' '}
            {examinationDataList?.totalCount ?? 0})
          </p>

          <div className={loading ? 'pointer-events-none opacity-60 transition-opacity' : ''}>
            <ExamSessionsTable
              sessions={filteredSessions}
              semesters={semesterDataList.items}
              onDelete={setDeleteExamSession}
              onEdit={setEditExamSession}
              onView={setViewExamSession}
            />
          </div>

          <Pagination
            currentPage={currentExaminationPage}
            onPageChange={setCurrentExaminationPage}
            totalPages={examinationDataList?.totalPages}
            onPageSizeChange={setPageExaminationSize}
            pageSize={pageExaminationSize}
          />

          <CreateExamSessionModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            semesters={semesterDataList.items}
            onRefresh={refresh}
          />

          <ViewExamSessionModal
            session={viewExamSession}
            onClose={() => setViewExamSession(null)}
          />
          <UpdateExamSessionModal
            examination={editExamSession}
            onClose={() => setEditExamSession(null)}
            semesters={semesterDataList.items}
            onRefresh={refresh}
          />
          <ConfirmDeleteExamModal
            examination={deleteExamSession}
            onClose={() => setDeleteExamSession(null)}
            onRefresh={refresh}
          />
        </>
      ) : (
        <p>Chưa có dữ liệu học kì</p>
      )}
    </div>
  )
}