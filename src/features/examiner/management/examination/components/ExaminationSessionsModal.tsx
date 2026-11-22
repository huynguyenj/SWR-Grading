import { FiCalendar, FiClock, FiEdit, FiFileText, FiTrash } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import { formatDate } from '@/utils/format'
import type { ExaminationType } from '@/features/admin/management/examination/types/examination.type'
import useGetExaminationSessions from '../hooks/useGetExamSession'
import ExamSessionStatusBadge from '@/features/admin/management/examination/components/ExaminationBadge'
import Button from '@/components/ui/button'

interface ExaminationSessionsModalProps {
  examination: ExaminationType
  onClose: () => void
}

export default function ExaminationSessionsModal({
  examination,
  onClose,
}: ExaminationSessionsModalProps) {
  const { examinationSessions, loading } = useGetExaminationSessions({
    examinationId: examination.examinationId,
  })

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Danh sách đợt thi - ${examination.name}`}
      maxWidth="xl"
    >
      <div className="px-4 py-5 overflow-y-auto">
        {/* Examination information */}
        <div className="rounded-lg border border-border-default bg-bg-muted/40 p-4">
          <p className="text-sm font-semibold text-text-primary">
            Thông tin kỳ thi
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-text-muted">Tên kỳ thi</p>
              <p className="mt-1 text-sm font-medium text-text-primary">
                {examination.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-text-muted">Mã kỳ thi</p>
              <p className="mt-1 text-sm text-text-primary">
                {examination.examinationCode || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Sessions list */}
        <div className='my-2 overflow-x-hidden'>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              Danh sách đợt thi
            </h3>

            {!loading && (
              <span className="text-xs text-text-muted">
                {examinationSessions.length} đợt thi
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-text-muted">
                Đang tải danh sách đợt thi...
              </p>
            </div>
          ) : examinationSessions.length === 0 ? (
            <div className="rounded-lg border border-border-default py-12 text-center">
              <FiFileText className="mx-auto h-8 w-8 text-text-muted" />

              <p className="mt-3 text-sm text-text-secondary">
                Kỳ thi này chưa có đợt thi nào.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border-default">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-default bg-bg-muted/50 text-left">
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Mã đợt thi
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Ngày thi
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Giờ thi
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 font-medium text-text-secondary">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {examinationSessions.map((session, index) => (
                    <tr
                      key={`${session.examinationId}-${session.paperSetId}-${index}`}
                      className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">
                            {session.examinationCode || '—'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-text-secondary">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="h-3.5 w-3.5 text-text-muted" />
                          {formatDate(session.startDate)}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-text-secondary">
                        <div className="flex items-center gap-2">
                          <FiClock className="h-3.5 w-3.5 text-text-muted" />
                          {session.startTime
                            ? session.startTime.slice(0, 5)
                            : '—'}
                        </div>
                      </td>


                      <td className="px-4 py-3">
                        <ExamSessionStatusBadge status={session.status} />
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        <div className='flex items-center justify-end gap-1'>
                        {/* Chỉnh sửa */}
                          <button
                              className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                              aria-label="Chỉnh sửa"
                          >
                              <FiEdit className="h-4 w-4" />
                          </button>  
                        {/* Xóa */}
                          <Button
                              variant="danger"
                              className="px-1.5 py-1"
                              aria-label="Xóa"
                          >
                              <FiTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}