import { FiCalendar, FiBookOpen, FiFileText, FiEye, FiEdit2 } from 'react-icons/fi'
import type { Semester } from '../types/semester'
import SemesterStatusBadge from './SemesterBadge'
import Button from '@/components/ui/button'

interface SemestersTableProps {
  semesters: Semester[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function SemestersTable({ semesters }: SemestersTableProps) {
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
            <th className="px-4 py-3 font-medium text-text-secondary">Môn học</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Kỳ thi</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
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
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiBookOpen className="w-3.5 h-3.5 text-text-muted" />
                  {semester.courseCount}
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiFileText className="w-3.5 h-3.5 text-text-muted" />
                  {semester.examCount}
                </div>
              </td>
              <td className="px-4 py-3">
                <SemesterStatusBadge status={semester.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant='basic'
                    className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                    aria-label="Xem chi tiết"
                  >
                    <FiEye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant='basic'
                    className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                    aria-label="Chỉnh sửa"
                  >
                    <FiEdit2 className="w-4 h-4" />
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