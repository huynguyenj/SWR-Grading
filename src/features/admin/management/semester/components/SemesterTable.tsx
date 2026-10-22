import { FiCalendar, FiEdit2, FiTrash } from 'react-icons/fi'
import SemesterStatusBadge from './SemesterBadge'
import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'
import type { SemesterType } from '../types/semester'

interface SemestersTableProps {
  semesters?: SemesterType[]
  onSelected: (semester: SemesterType) => void
  onDeleted: (semester: SemesterType) => void
}


export default function SemestersTable({ semesters, onSelected, onDeleted }: SemestersTableProps) {
  if (!semesters) {
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
            {/* <th className="px-4 py-3 font-medium text-text-secondary">Kỳ thi</th> */}
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester) => (
            <tr
              key={semester.semesterId}
              className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-text-primary">{semester.name}</td>
              <td className="px-4 py-3 text-text-secondary">{semester.semesterCode}</td>
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
              {/* <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiFileText className="w-3.5 h-3.5 text-text-muted" />
                  {semester.examCount}
                </div>
              </td> */}
              <td className="px-4 py-3">
                <SemesterStatusBadge status={semester.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {/* <Button
                    variant='basic'
                    className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                    aria-label="Xem chi tiết"
                  >
                    <FiEye className="w-4 h-4" />
                  </Button> */}
                  <Button
                    variant='basic'
                    onClick={() => onSelected(semester)}
                    className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                    aria-label="Chỉnh sửa"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </Button>
                   <Button
                    variant='danger'
                    onClick={() => onDeleted(semester)}
                    className="rounded-md p-1.5 text-text-on-brand hover:bg-bg-muted hover:text-text-primary transition-colors"
                    aria-label="Chỉnh sửa"
                  >
                    <FiTrash className="w-4 h-4" />
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