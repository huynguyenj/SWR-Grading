import { FiCalendar, FiClock } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { formatDate } from '@/utils/format'
import ExamSessionStatusBadge from './ExaminationBadge'
import {
  EXAMINATION_KIND_LABEL,
  toShortTime,
  type ExaminationType,
} from '../types/examination.type'
import type { SemesterType } from '../../semester/types/semester'

interface ViewExamSessionModalProps {
  session: ExaminationType | null
  onClose: () => void
  semesters: SemesterType[]
}

export default function ViewExamSessionModal({
  session,
  onClose,
  semesters,
}: ViewExamSessionModalProps) {
  const semesterName = session
    ? (semesters.find((s) => s.semesterId === session.semesterId)?.name ?? '—')
    : ''

  return (
    <Modal open={session !== null} onClose={onClose} title={session?.name} maxWidth="lg">
      {session && (
        <div className="px-5 py-4 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <ExamSessionStatusBadge status={session.status} />
            <span className="text-sm text-text-secondary">
              · {semesterName} · {EXAMINATION_KIND_LABEL[session.examinationType]}
            </span>
          </div>

          <p className="text-xs text-text-muted">Mã đợt thi: {session.examinationCode}</p>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Thời gian tổ chức</h3>
            <div className="grid grid-cols-1 gap-2 rounded-md bg-bg-muted/50 p-4 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <FiCalendar className="w-4 h-4 text-text-muted shrink-0" />
                {formatDate(session.startDate)}
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <FiClock className="w-4 h-4 text-text-muted shrink-0" />
                Bắt đầu {toShortTime(session.startTime)} · kéo dài {session.durationMinutes} phút
              </div>
              <div className="sm:col-span-2 text-xs text-text-muted">
                Bài thi được mở trước giờ thi {session.beforeTimeMinutes} phút.
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Ghi chú</h3>
            {session.note ? (
              <p className="whitespace-pre-line text-sm text-text-secondary">{session.note}</p>
            ) : (
              <p className="text-sm text-text-muted">Không có ghi chú.</p>
            )}
          </div>

          <div className="flex justify-end border-t border-border-default pt-4">
            <Button variant="basic" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}