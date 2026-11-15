
import { useMemo, useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import Pagination from '@/components/ui/pagination'
import useGetExaminerStudents from '@/features/examiner/management/student/hooks/useGetExaminerStudent'
import ExaminerStudentTable from '@/features/examiner/management/student/components/ExaminerStudentTable'
import ExaminerStudentsToolbar from '@/features/examiner/management/student/components/ExaminerStudentToolbar'
import UploadStudentInformationFileModal from '@/features/examiner/management/student/components/UploadStudentInformationFileModal'
import SemesterSelect from '@/features/admin/management/semester/components/SemesterSelect'
import ExaminationSelect from '@/features/manager/dashboard/components/ExaminationSelect'

export default function ExaminerStudentPage() {
  const {
    examinerStudentDataList,
    loading,

    currentStudentPage,
    pageStudentSize,
    setCurrentStudentPage,
    setPageStudentSize,

    search,
    setSearch,

    refresh,
    examinationId,
    semesterId, 
    setExaminationId,
    setSemesterId
  } = useGetExaminerStudents()
  const [isUpload, setIsUpload] = useState(false)
  const students = examinerStudentDataList?.items ?? []
  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageStudentSize(size)
    setCurrentStudentPage(1)
  }

  // Statistics
  const statistics = useMemo(() => {
    const totalStudents = examinerStudentDataList?.totalCount ?? 0

    const activeStudents = students.filter(
      (student) => student.isActive,
    ).length

    const inactiveStudents = students.filter(
      (student) => !student.isActive,
    ).length

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
    }
  }, [examinerStudentDataList?.totalCount, students])
  const handleSemesterChange = (newSemesterId: string) => {
    const selectedSemesterId = newSemesterId === 'all' ? '' : newSemesterId
    setSemesterId(selectedSemesterId)
    // Reset examination when semester changes
    setExaminationId('')
  }
  const handleExaminationChange = (newExaminationId: string) => {
    const selectedExaminationId = newExaminationId === 'all' ? '' : newExaminationId
    setExaminationId(selectedExaminationId)
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className='flex justify-between'>
        <div>
          <div className="flex items-center gap-2">
            <FiUsers className="h-6 w-6 text-brand-orange" />

            <h1 className="text-2xl font-semibold text-text-primary">
              Quản lý sinh viên
            </h1>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            Quản lý danh sách và trạng thái tài khoản sinh viên trong hệ thống.
          </p>
        </div>
          <div className='flex gap-2 justify-end'>
            <SemesterSelect
              value={semesterId}
              onChange={handleSemesterChange}
            />
            <ExaminationSelect
              value={examinationId}
              onChange={handleExaminationChange}
            />
          </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">
            Tổng sinh viên
          </p>

          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {statistics.totalStudents}
          </p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">
            Đang hoạt động
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {statistics.activeStudents}
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
            {statistics.inactiveStudents}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Trong trang hiện tại
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <ExaminerStudentsToolbar
        search={search}
        onSearchChange={setSearch}
        onRefresh={refresh}
        loading={loading}
        onUpload={() => setIsUpload(true)}
      />

      {/* Student Table */}
      <ExaminerStudentTable
        students={students}
        loading={loading}
      />

      {/* Pagination */}
      {examinerStudentDataList && examinerStudentDataList.totalPages > 0 && (
        <Pagination
          currentPage={currentStudentPage}
          onPageChange={setCurrentStudentPage}
          totalPages={examinerStudentDataList.totalPages}
          pageSize={pageStudentSize}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <UploadStudentInformationFileModal
          open={isUpload}
          onClose={() => setIsUpload(false)}
          onRefresh={refresh}
      />
    </div>
  )
}
