import { useState } from 'react'
import {
  FiCalendar,
  FiEdit,
  FiEye,
  FiList,
  FiPlus,
  FiTrash,
} from 'react-icons/fi'

import {
  EXAMINATION_KIND_LABEL,
  type ExaminationType,
} from '../types/examination.type'
import type { SemesterType } from '../../semester/types/semester'
import { formatDate } from '@/utils/format'
import ExamSessionStatusBadge from './ExaminationBadge'
import Button from '@/components/ui/button'
import ExaminationSessionsModal from '@/features/examiner/management/examination/components/ExaminationSessionsModal'
import CreateExaminationSessionModal from '@/features/examiner/management/examination/components/CreateExaminationSessionModal'

interface ExamSessionsTableProps {
  sessions: ExaminationType[]
  semesters: SemesterType[]
  onView: (exam: ExaminationType) => void
  onEdit: (exam: ExaminationType) => void
  onDelete: (exam: ExaminationType) => void
  onRefresh?: () => void
}

export default function ExaminationTable({
  sessions,
  semesters,
  onDelete,
  onEdit,
  onView,
  onRefresh
}: ExamSessionsTableProps) {
  const [selectedExamination, setSelectedExamination] =
    useState<ExaminationType | null>(null)
  const [creatingExamination, setCreatingExamination] =
  useState<ExaminationType | null>(null)
  function semesterName(id: string) {
    return semesters.find((s) => s.semesterId === id)?.name ?? '—'
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">
          Không tìm thấy đợt thi nào phù hợp.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">
                Kì thi
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary">
                Học kỳ
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary">
                Loại
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary">
                Thời gian
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary">
                Trạng thái
              </th>
              <th className="px-4 py-3 font-medium text-text-secondary text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.examinationId}
                className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-text-primary">
                    {session.name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {session.examinationCode}
                  </p>
                </td>

                <td className="px-4 py-3 text-text-secondary">
                  {semesterName(session.semesterId)}
                </td>

                <td className="px-4 py-3 text-text-secondary">
                  {EXAMINATION_KIND_LABEL[session.examinationType] ?? '—'}
                </td>

                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="h-3.5 w-3.5 text-text-muted" />
                    {formatDate(session.startDate)}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <ExamSessionStatusBadge status={session.status} />
                </td>

                <td className="px-4 py-3">
                  <div className="grid grid-cols-3 items-center justify-end gap-1">
                    <button
                      onClick={() => setCreatingExamination(session)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-success transition-colors"
                      aria-label="Tạo đợt thi"
                      title="Tạo đợt thi"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                    {/* Xem chi tiết */}
                    <button
                      onClick={() => onView(session)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                      aria-label="Xem chi tiết"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>

                    {/* Chỉnh sửa */}
                    <button
                      onClick={() => onEdit(session)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-text-primary transition-colors"
                      aria-label="Chỉnh sửa"
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>

                    {/* Xem danh sách đợt thi */}
                    <button
                      onClick={() => setSelectedExamination(session)}
                      className="rounded-md p-1.5 text-text-muted hover:bg-bg-muted hover:text-brand-orange transition-colors"
                      aria-label="Xem danh sách đợt thi"
                      title="Đợt thi"
                    >
                      <FiList className="h-4 w-4" />
                    </button>

                    {/* Xóa */}
                    <Button
                      onClick={() => onDelete(session)}
                      variant="danger"
                      className="px-1.5 py-1 w-fit"
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

      {/* Examination sessions modal */}
      {selectedExamination && (
        <ExaminationSessionsModal
          examination={selectedExamination}
          onClose={() => setSelectedExamination(null)}
        />
      )}
      {creatingExamination && (
        <CreateExaminationSessionModal
          examination={creatingExamination}
          onClose={() => setCreatingExamination(null)}
          onCreated={() => {
            onRefresh?.()
          }}
        />
      )}
    </> 
  )
}