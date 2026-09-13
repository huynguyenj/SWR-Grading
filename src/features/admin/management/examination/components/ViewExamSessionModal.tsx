import { FiCalendar, FiClock, FiFileText, FiShuffle, FiUser } from 'react-icons/fi'
import { examRuleOptions, mockExamPapers, type ExamSession } from '../types/examination.type'
import Modal from '@/components/ui/modal'
import ExamSessionStatusBadge from './ExaminationBadge'
import { formatDate } from '@/utils/format'
import Button from '@/components/ui/button'
import type { SemesterType } from '../../semester/types/semester'
interface ViewExamSessionModalProps {
  session: ExamSession | null
  onClose: () => void
  semesters: SemesterType[]
}

export default function ViewExamSessionModal({
  session,
  onClose,
  semesters,
}: ViewExamSessionModalProps) {
  const semesterName = session
    ? semesters.find((s) => s.semesterId === session.semesterId)?.name ?? '—'
    : ''
  const assignedPaper = session?.assignedPaperId
    ? mockExamPapers.find((p) => p.id === session.assignedPaperId)
    : undefined
  const activeRules = session
    ? examRuleOptions.filter((r) => session.rules.includes(r.key))
    : []

  return (
    <Modal open={session !== null} onClose={onClose} title={session?.name} maxWidth="lg">
      {session && (
        <div className="px-5 py-4 space-y-5">
          {/* Trạng thái + học kỳ */}
          <div className="flex flex-wrap items-center gap-2">
            <ExamSessionStatusBadge status={session.status} />
            <span className="text-sm text-text-secondary">· {semesterName}</span>
          </div>

          {/* Thời gian tổ chức */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Thời gian tổ chức</h3>
            <div className="grid grid-cols-1 gap-2 rounded-md bg-bg-muted/50 p-4 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <FiCalendar className="w-4 h-4 text-text-muted shrink-0" />
                {formatDate(session.examDate)}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <FiClock className="w-4 h-4 text-text-muted shrink-0" />
                Bắt đầu {session.startTime} · kéo dài {session.durationMinutes} phút
              </div>
              <div className="sm:col-span-2 text-xs text-text-muted">
                Bài thi được mở trước giờ thi {session.openBeforeMinutes} phút.
              </div>
            </div>
          </div>

          {/* Đề thi */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Đề thi</h3>
            <div className="rounded-md border border-border-default p-4 text-sm">
              {session.paperMode === 'random' ? (
                <div className="flex items-center gap-2 text-text-secondary">
                  <FiShuffle className="w-4 h-4 text-text-muted shrink-0" />
                  Random {session.randomPoolSize} đề trong ngân hàng đề của học kỳ này
                </div>
              ) : (
                <div className="flex items-center gap-2 text-text-secondary">
                  <FiFileText className="w-4 h-4 text-text-muted shrink-0" />
                  <span>
                    {assignedPaper ? assignedPaper.fileName : 'Chưa chọn đề'}
                    {assignedPaper && (
                      <span className="ml-1.5 inline-flex items-center gap-1 text-xs text-text-muted">
                        <FiUser className="w-3 h-3" />
                        {assignedPaper.uploadedBy}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Yêu cầu & quy định */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">
              Yêu cầu & quy định khi thi
            </h3>
            {activeRules.length > 0 ? (
              <ul className="space-y-1.5">
                {activeRules.map((rule) => (
                  <li
                    key={rule.key}
                    className="flex items-center gap-2 rounded-md bg-bg-muted/50 px-3 py-2 text-sm text-text-secondary"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                    {rule.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">Không có yêu cầu đặc biệt nào.</p>
            )}

            {session.notes && (
              <p className="mt-2 text-sm text-text-secondary whitespace-pre-line">
                {session.notes}
              </p>
            )}
          </div>

          <div className="flex justify-end border-t border-border-default pt-4">
            <Button
              onClick={onClose}
              variant='basic'
            >
              Đóng
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}