import Modal from '@/components/ui/modal'
import type { ExaminationSessionType } from '@/features/examiner/management/examination/types/exam_session'
import { formatDate } from '@/utils/format'
import {
  FiBookOpen,
  FiFileText,
  FiLayers,
  FiUsers,
} from 'react-icons/fi'

interface ExaminationSessionDetailModalProps {
  session?: ExaminationSessionType
  isOpen: boolean
  onClose: () => void
}

interface InfoItemProps {
  label: string
  value?: string | number
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-text-primary">
        {value ?? 'Chưa có thông tin'}
      </p>
    </div>
  )
}


export default function ExaminationSessionDetailModal({
  session,
  isOpen,
  onClose,
}: ExaminationSessionDetailModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Chi tiết đợt thi"
      maxWidth="xl"
    >
      {!session ? null : (
        <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5">
          {/* Examination session */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <FiFileText className="h-5 w-5 text-brand-orange" />
              <h3 className="font-semibold text-text-primary">
                Thông tin đợt thi
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-lg border border-border-default bg-bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Mã đợt thi"
                value={session.examinationCode}
              />

              <InfoItem
                label="Ngày thi"
                value={formatDate(session.startDate)}
              />

              <InfoItem
                label="Giờ bắt đầu"
                value={(session.startTime)}
              />

              <InfoItem
                label="Tổng bài nộp"
                value={session.totalSubmission}
              />

              <InfoItem
                label="Số lượng sinh viên"
                value={session.students?.length ?? 0}
              />

              <InfoItem
                label="Trạng thái"
                value={String(session.status)}
              />
            </div>
          </section>

          {/* Examination */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <FiBookOpen className="h-5 w-5 text-brand-orange" />
              <h3 className="font-semibold text-text-primary">
                Thông tin kỳ thi
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-lg border border-border-default bg-bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Tên kỳ thi"
                value={session.examination?.name}
              />

              <InfoItem
                label="Ngày bắt đầu"
                value={
                  session.examination?.startDate
                    ? formatDate(session.examination.startDate)
                    : undefined
                }
              />

              <InfoItem
                label="Ngày kết thúc"
                value={
                  session.examination?.endDate
                    ? formatDate(session.examination.endDate)
                    : undefined
                }
              />
            </div>
          </section>

          {/* Semester */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <FiLayers className="h-5 w-5 text-brand-orange" />
              <h3 className="font-semibold text-text-primary">
                Thông tin học kỳ
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-lg border border-border-default bg-bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Tên học kỳ"
                value={session.semester?.name}
              />

              <InfoItem
                label="Mã học kỳ"
                value={session.semester?.semesterCode}
              />

              <InfoItem
                label="Ngày bắt đầu"
                value={
                  session.semester?.startDate
                    ? formatDate(session.semester.startDate)
                    : undefined
                }
              />

              <InfoItem
                label="Ngày kết thúc"
                value={
                  session.semester?.endDate
                    ? formatDate(session.semester.endDate)
                    : undefined
                }
              />
            </div>
          </section>

          {/* Students */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiUsers className="h-5 w-5 text-brand-orange" />
                <h3 className="font-semibold text-text-primary">
                  Danh sách sinh viên
                </h3>
              </div>

              <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange">
                {session.students?.length ?? 0} sinh viên
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border-default">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border-default bg-bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      STT
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Mã sinh viên
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Họ và tên
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Email
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {session.students?.length ? (
                    session.students.map((student, index) => (
                      <tr
                        key={student.studentId}
                        className="border-b border-border-default last:border-0 hover:bg-bg-muted/30"
                      >
                        <td className="px-4 py-3 text-text-muted">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium text-text-primary">
                          {student.studentCode}
                        </td>

                        <td className="px-4 py-3 text-text-primary">
                          {student.fullName}
                        </td>

                        <td className="px-4 py-3 text-text-secondary">
                          {student.email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-10 text-center text-sm text-text-muted"
                      >
                        Chưa có sinh viên trong đợt thi này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </Modal>
  )
}