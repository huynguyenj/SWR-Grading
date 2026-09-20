import { FiFolder, FiArrowRight, FiUser, FiFileText } from 'react-icons/fi'
import Pagination from '@/components/ui/pagination'
import useGetGradingDiary from '../hooks/useGetGradingDiary'



export default function GradingLogsTable() {
  const {
    gradingDiaryList,
    loading,
    currentSemesterPage,
    pageSemesterSize,
    setCurrentSemesterPage,
    setPageSemesterSize,
  } = useGetGradingDiary()

  const logs = gradingDiaryList?.items ?? []

  if (loading) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Đang tải danh sách nhật ký...</p>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Chưa có nhật ký chấm điểm nào.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary mb-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">Nhật ký</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Nội dung</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Bộ đề</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Giảng viên</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Số bài đã nộp</th>
              <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.gradingDiaryId}
                className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-text-primary">{log.name}</td>
                <td className="px-4 py-3 text-text-secondary max-w-[220px]">
                  <span className="line-clamp-1">{log.content || '—'}</span>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiFileText className="w-3.5 h-3.5 text-text-muted" />
                    {log.paperSetCode}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiUser className="w-3.5 h-3.5 text-text-muted" />
                    {log.lecturerName}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiFolder className="w-3.5 h-3.5 text-text-muted" />
                    {log.submissionsCount}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:text-brand-rust transition-colors"
                  >
                    Mở
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentSemesterPage}
        onPageChange={setCurrentSemesterPage}
        totalPages={gradingDiaryList?.totalPages}
        onPageSizeChange={setPageSemesterSize}
        pageSize={pageSemesterSize}
      />
    </div>
  )
}