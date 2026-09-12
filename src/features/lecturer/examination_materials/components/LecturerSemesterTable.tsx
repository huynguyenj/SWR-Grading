import Button from '@/components/ui/button'
import SemesterStatusBadge from '@/features/admin/management/semester/components/SemesterBadge'
import type { Semester } from '@/features/admin/management/semester/types/semester'
import { formatDate } from '@/utils/format'
import { FiCalendar, FiEye, FiFileText, FiUploadCloud } from 'react-icons/fi'

interface LecturerSemestersTableProps {
  semesters: Semester[]
  onOpenUpload: (semester: Semester) => void
  onOpenDetail: (semester: Semester) => void
}


export default function LecturerSemestersTable({
  semesters,
  onOpenUpload,
  onOpenDetail
}: LecturerSemestersTableProps) {
  if (semesters.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Không tìm thấy học kỳ nào phù hợp.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">Học kỳ</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Mã</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Thời gian</th>
            {/* <th className="px-4 py-3 font-medium text-text-secondary">Môn học</th> */}
            <th className="px-4 py-3 font-medium text-text-secondary">Kỳ thi</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Tài liệu</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester) => (
            <tr
              key={semester.id}
              className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-text-primary">{semester.name}</td>
              <td className="px-4 py-3 text-text-secondary">{semester.code}</td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                  {formatDate(semester.startDate)} – {formatDate(semester.endDate)}
                </div>
              </td>
              {/* <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiBookOpen className="w-3.5 h-3.5 text-text-muted" />
                  {semester.courseCount}
                </div>
              </td> */}
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiFileText className="w-3.5 h-3.5 text-text-muted" />
                  {semester.examCount}
                </div>
              </td>
              <td className="px-4 py-3">
                <SemesterStatusBadge status={semester.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className='flex items-center justify-end gap-2'>
                  {semester.status !== 'completed' &&
                    <button
                      onClick={() => onOpenUpload(semester)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-brand-orange hover:text-brand-orange transition-colors"
                    >
                      <FiUploadCloud className="w-3.5 h-3.5" />
                      Tài liệu
                    </button>
                  }
                    <Button
                      variant='basic'
                      onClick={() => onOpenDetail(semester)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-bhover:text-text-primary transition-colors"
                      aria-label="Xem chi tiết"
                    >
                      <FiEye className="w-4 h-4" />
                    </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}