import { FiCalendar, FiClock, FiFileText, FiShuffle, FiEye } from 'react-icons/fi'
import type { ExamSession } from '../types/examination.type'
import { formatDate } from '@/utils/format'
import ExamSessionStatusBadge from './ExaminationBadge'
import type { SemesterType } from '../../semester/types/semester'

interface ExamSessionsTableProps {
  sessions: ExamSession[]
  semesters: SemesterType[]
  onView: (session: ExamSession) => void
}


export default function ExamSessionsTable({ sessions, semesters, onView }: ExamSessionsTableProps) {
  function semesterName(id: string) {
    return semesters.find((s) => s.semesterId === id)?.name ?? '—'
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Không tìm thấy đợt thi nào phù hợp.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">Đợt thi</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Học kỳ</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Thời gian</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Đề thi</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr
              key={session.id}
              className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-text-primary">{session.name}</td>
              <td className="px-4 py-3 text-text-secondary">{semesterName(session.semesterId)}</td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                  {formatDate(session.examDate)}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
                  <FiClock className="w-3.5 h-3.5" />
                  {session.startTime} · {session.durationMinutes} phút · mở trước{' '}
                  {session.openBeforeMinutes} phút
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  {session.paperMode === 'random' ? (
                    <>
                      <FiShuffle className="w-3.5 h-3.5 text-text-muted" />
                      Ngẫu nhiên ({session.randomPoolSize} đề)
                    </>
                  ) : (
                    <>
                      <FiFileText className="w-3.5 h-3.5 text-text-muted" />
                      Chỉ định
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <ExamSessionStatusBadge status={session.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onView(session)}
                  className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                  aria-label="Xem chi tiết"
                >
                  <FiEye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}