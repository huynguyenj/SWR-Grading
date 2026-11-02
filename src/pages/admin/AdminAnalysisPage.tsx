import {  useState } from 'react'
import {
  FiBookOpen,
} from 'react-icons/fi'

import LecturerPerformanceTable from '@/features/admin/data/components/LecturerPerformanceTable'

import useGetLecturersPerformance from '@/features/admin/data/hooks/useGetLecturerPerformance'
import useGetSemesterStatistics from '@/features/admin/data/hooks/useGetSemesterStatistics'

import SemesterSelect from '@/features/admin/management/semester/components/SemesterSelect'


function getSemesterStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Đang diễn ra'

    case 'upcoming':
      return 'Sắp diễn ra'

    case 'completed':
      return 'Đã kết thúc'

    default:
      return status
  }
}

function getSemesterStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-success/10 text-success'

    case 'upcoming':
      return 'bg-warning/10 text-warning'

    case 'completed':
      return 'bg-bg-muted text-text-secondary'

    default:
      return 'bg-bg-muted text-text-secondary'
  }
}

export default function AdminAnalysisPage() {
  // =========================================================
  // 1. API THỐNG KÊ HỌC KỲ
  // =========================================================

  const {
    semesters,
    loading: semestersLoading,
    error: semestersError,
    refresh: refreshSemesters,
  } = useGetSemesterStatistics()

  // Học kỳ đang được người dùng lựa chọn.
  // Ban đầu chưa có giá trị vì API thống kê chưa trả dữ liệu.
  const [semesterId, setSemesterId] = useState('')

  // Tự động chọn học kỳ đầu tiên sau khi API thống kê trả dữ liệu.
  // Không chặn việc render phần thống kê trong thời gian chờ cập nhật state.

  // Tìm học kỳ tương ứng với semesterId hiện tại.
  const selectedSemester = semesters.find(
    (semester) => semester.semesterId === semesterId,
  )

  // Dữ liệu dùng để render phần thống kê.
  //
  // Nếu chưa có semesterId nhưng API đã trả dữ liệu,
  // sử dụng học kỳ đầu tiên để hiển thị ngay.
  //
  // Khi người dùng chọn học kỳ khác, hiển thị học kỳ tương ứng.
  const displaySemester = selectedSemester ?? semesters[0]

  // =========================================================
  // 2. API HIỆU SUẤT GIẢNG VIÊN
  // =========================================================

  const hasValidSemesterId =
    semesterId !== '' && semesterId !== 'all'

  const {
    lecturers,
    loading: lecturersLoading,
    error: lecturersError,
    refresh: refreshLecturers,
  } = useGetLecturersPerformance({ semesterId })

  // =========================================================
  // 3. REFRESH
  // =========================================================

  const handleRefresh = () => {
    refreshSemesters()

    // Chỉ refresh dữ liệu giảng viên khi có semesterId hợp lệ.
    if (hasValidSemesterId) {
      refreshLecturers()
    }
  }

  // =========================================================
  // 4. RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =================================================== */}
      {/* HEADER */}
      {/* =================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Tổng quan hệ thống
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            Theo dõi tình hình kỳ thi, kết quả chấm điểm và hiệu suất giảng viên.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={semestersLoading || lecturersLoading}
          className="inline-flex items-center justify-center rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-text-on-brand transition-colors hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {semestersLoading || lecturersLoading
            ? 'Đang tải...'
            : 'Làm mới dữ liệu'}
        </button>
      </div>

      {/* =================================================== */}
      {/* SEMESTER SELECTOR */}
      {/* =================================================== */}

      <section className="rounded-lg border border-border-default bg-bg-primary p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Thống kê theo học kỳ
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Chọn học kỳ để xem số liệu và hiệu suất giảng viên tương ứng.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <SemesterSelect
              value={semesterId || 'all'}
              onChange={(selectedSemesterId) => {
                setSemesterId(selectedSemesterId)
              }}
            />
          </div>
        </div>

        {/* Thông tin học kỳ được chọn */}
        {displaySemester && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-default pt-4">
            <span className="text-sm font-medium text-text-primary">
              {displaySemester.semesterCode}
            </span>

            <span className="text-sm text-text-secondary">
              {displaySemester.semesterName}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getSemesterStatusClass(
                displaySemester.status,
              )}`}
            >
              {getSemesterStatusLabel(displaySemester.status)}
            </span>
          </div>
        )}
      </section>

      {/* =================================================== */}
      {/* PHẦN 1: API THỐNG KÊ HỌC KỲ */}
      {/* =================================================== */}

      {/* Lỗi API thống kê học kỳ */}
      {semestersError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-danger">
            Không thể tải thống kê học kỳ: {semestersError}
          </p>

          <button
            type="button"
            onClick={refreshSemesters}
            className="shrink-0 text-sm font-medium text-brand-orange hover:underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading lần đầu của API thống kê */}
      {semestersLoading && semesters.length === 0 && (
        <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
          <p className="text-sm text-text-secondary">
            Đang tải dữ liệu thống kê học kỳ...
          </p>
        </div>
      )}

      {/* Không có dữ liệu học kỳ */}
      {!semestersLoading &&
        !semestersError &&
        semesters.length === 0 && (
          <div className="rounded-lg border border-border-default bg-bg-primary px-5 py-16 text-center">
            <FiBookOpen className="mx-auto h-8 w-8 text-text-muted" />

            <p className="mt-3 text-sm font-medium text-text-primary">
              Chưa có dữ liệu học kỳ
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Hệ thống chưa có dữ liệu thống kê để hiển thị.
            </p>
          </div>
        )}

      {/* =================================================== */}
      {/* PHẦN 2: API HIỆU SUẤT GIẢNG VIÊN */}
      {/* Chỉ phụ thuộc vào semesterId */}
      {/* =================================================== */}

      {hasValidSemesterId && (
        <section>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-text-primary">
              Hiệu suất giảng viên
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Thống kê khối lượng và tiến độ chấm điểm của giảng viên trong học kỳ{' '}
              {selectedSemester?.semesterCode ?? displaySemester?.semesterCode}.
            </p>
          </div>

          {/* Lỗi API hiệu suất giảng viên */}
          {lecturersError && (
            <div
              role="alert"
              className="mb-3 flex flex-col gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-danger">
                Không thể tải hiệu suất giảng viên: {lecturersError}
              </p>

              <button
                type="button"
                onClick={refreshLecturers}
                className="shrink-0 text-sm font-medium text-brand-orange hover:underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Loading API giảng viên */}
          {lecturersLoading && lecturers.length === 0 ? (
            <div className="rounded-lg border border-border-default bg-bg-primary py-12 text-center">
              <p className="text-sm text-text-secondary">
                Đang tải hiệu suất giảng viên...
              </p>
            </div>
          ) : (
            <div
              className={
                lecturersLoading
                  ? 'opacity-60 transition-opacity'
                  : 'transition-opacity'
              }
            >
              <LecturerPerformanceTable data={lecturers} />
            </div>
          )}
        </section>
      )}
    </div>
  )
}