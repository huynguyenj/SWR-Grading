
import { FiEdit, FiFileText, FiLayers } from 'react-icons/fi'
import type { LecturerType } from '../types/lecturer.type'

interface LecturerTableProps {
  lecturers: LecturerType[]
  onEdit: (lecturer: LecturerType) => void
}

export default function LecturerTable({
  lecturers,
  onEdit,
}: LecturerTableProps) {
  if (lecturers.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">
          Không tìm thấy giảng viên phù hợp.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">
              Giảng viên
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Email
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Chuyên ngành
            </th>

            <th className="px-4 py-3 text-center font-medium text-text-secondary">
              Bộ đề
            </th>

            <th className="px-4 py-3 text-center font-medium text-text-secondary">
              Tổng lượng nhật kí
            </th>

            <th className="px-4 py-3 font-medium text-text-secondary">
              Trạng thái
            </th>

            <th className="px-4 py-3 text-right font-medium text-text-secondary">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {lecturers.map((lecturer) => (
            <tr
              key={lecturer.id}
              className="border-b border-border-default transition-colors last:border-0 hover:bg-bg-muted/40"
            >
              {/* LECTURER */}
              <td className="px-4 py-3">
                <p className="font-medium text-text-primary">
                  {lecturer.fullName}
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  {lecturer.lecturerCode}
                </p>
              </td>

              {/* EMAIL */}
              <td className="px-4 py-3 text-text-secondary">
                {lecturer.email}
              </td>

              {/* SUBJECT */}
              <td className="px-4 py-3 text-text-secondary">
                {lecturer.subject || '—'}
              </td>

              {/* PAPER SETS */}
              <td className="px-4 py-3 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 text-text-secondary">
                  <FiLayers className="h-3.5 w-3.5 text-text-muted" />
                  {lecturer.paperSetsCount}
                </div>
              </td>

              {/* GRADING DIARIES */}
              <td className="px-4 py-3 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 text-text-secondary">
                  <FiFileText className="h-3.5 w-3.5 text-text-muted" />
                  {lecturer.gradingDiariesCount}
                </div>
              </td>

              {/* STATUS */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    lecturer.isActive
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  }`}
                >
                  {lecturer.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(lecturer)}
                  className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-muted hover:text-text-primary"
                  aria-label={`Chỉnh sửa ${lecturer.fullName}`}
                  title="Chỉnh sửa"
                >
                  <FiEdit className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
