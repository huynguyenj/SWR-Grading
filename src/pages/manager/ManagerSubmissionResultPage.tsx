import { useState } from 'react'
import { FiAward } from 'react-icons/fi'

import Pagination from '@/components/ui/pagination'
import SemesterSelect from '@/features/admin/management/semester/components/SemesterSelect'
import ExaminationSelect from '@/features/manager/dashboard/components/ExaminationSelect'
import useGetOfficialSubmissions from '@/features/manager/submissions/hooks/useGetOfficialSubmissions'
import type { OfficialSubmission } from '@/features/manager/submissions/types/official_submission'
import OfficialSubmissionTable from '@/features/manager/submissions/components/OfficialSubmissionTable'
import ViewOfficialSubmissionModal from '@/features/manager/submissions/components/ViewOfficialSubmissionModal'


export default function ManagerSubmissionResultPage() {
  const {
    officialSubmissionDataList,
    loading,

    currentOfficialSubmissionPage,
    pageOfficialSubmissionSize,
    setCurrentOfficialSubmissionPage,
    setPageOfficialSubmissionSize,

    examinationId,
    semesterId,
    setExaminationId,
    setSemesterId,

    refresh,
  } = useGetOfficialSubmissions()

  const [selectedSubmission, setSelectedSubmission] =
    useState<OfficialSubmission | null>(null)

  const submissions = officialSubmissionDataList?.items ?? []

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageOfficialSubmissionSize(size)
    setCurrentOfficialSubmissionPage(1)
  }

  // Handle semester change
  const handleSemesterChange = (newSemesterId: string) => {
    const selectedSemesterId =
      newSemesterId === 'all' ? '' : newSemesterId

    setSemesterId(selectedSemesterId)
    setExaminationId('')
    setCurrentOfficialSubmissionPage(1)
  }

  // Handle examination change
  const handleExaminationChange = (newExaminationId: string) => {
    const selectedExaminationId =
      newExaminationId === 'all' ? '' : newExaminationId

    setExaminationId(selectedExaminationId)
    setCurrentOfficialSubmissionPage(1)
  }

  return (
    <div className="space-y-6">
      {/* ===== Page Header ===== */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FiAward className="h-6 w-6 text-brand-orange" />

            <h1 className="text-2xl font-semibold text-text-primary">
              Báo cáo điểm chính thức
            </h1>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            Theo dõi kết quả chấm thi chính thức của sinh viên.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
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

      {/* ===== Statistics ===== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">
            Tổng bài thi chính thức
          </p>

          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {officialSubmissionDataList?.totalCount ?? 0}
          </p>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-primary p-4">
          <p className="text-sm text-text-secondary">
            Bài thi trong trang hiện tại
          </p>

          <p className="mt-2 text-2xl font-semibold text-brand-orange">
            {submissions.length}
          </p>
        </div>
      </div>

      {/* ===== Toolbar ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary">
          Danh sách kết quả chấm chính thức
        </p>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-primary px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={loading ? 'animate-spin' : ''}>
            ↻
          </span>
          Làm mới
        </button>
      </div>

      {/* ===== Table ===== */}
      <OfficialSubmissionTable
        submissions={submissions}
        loading={loading}
        onViewDetail={setSelectedSubmission}
      />

      {/* ===== Pagination ===== */}
      {officialSubmissionDataList &&
        officialSubmissionDataList.totalPages > 0 && (
          <Pagination
            currentPage={currentOfficialSubmissionPage}
            onPageChange={setCurrentOfficialSubmissionPage}
            totalPages={officialSubmissionDataList.totalPages}
            pageSize={pageOfficialSubmissionSize}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

      {/* ===== Detail Modal ===== */}
      <ViewOfficialSubmissionModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  )
}