import { FiCalendar } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import type { Semester } from '@/features/admin/management/semester/types/semester'
import SemesterStatusBadge from '@/features/admin/management/semester/components/SemesterBadge'
import type { UploadedFile } from '@/components/ui/FileUploadZone'
import FileUploadDropzone from '@/components/ui/FileUploadZone'

interface UploadDocumentsModalProps {
  semester: Semester | null
  onClose: () => void
  files: UploadedFile[]
  onFilesAdded: (files: UploadedFile[]) => void
  onRemoveFile: (id: string) => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function UploadDocumentsModal({
  semester,
  onClose,
  files,
  onFilesAdded,
  onRemoveFile,
}: UploadDocumentsModalProps) {
  return (
    <Modal open={semester !== null} onClose={onClose} title={semester?.name} maxWidth="lg">
      {semester && (
        <div className="px-5 py-4 space-y-5">
          {/* Thông tin tóm tắt học kỳ — chỉ xem, không sửa được */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md bg-bg-muted/50 px-4 py-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
              {formatDate(semester.startDate)} – {formatDate(semester.endDate)}
            </span>
            {/* <span className="flex items-center gap-1.5">
              <FiBookOpen className="w-3.5 h-3.5 text-text-muted" />
              {semester.courseCount} môn học
            </span> */}
            {/* <span className="flex items-center gap-1.5">
              <FiFileText className="w-3.5 h-3.5 text-text-muted" />
              {semester.examCount} kỳ thi
            </span> */}
            <SemesterStatusBadge status={semester.status} />
          </div>

          {/* Upload tài liệu */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">
              Tài liệu học kỳ
            </h3>
            <FileUploadDropzone
              files={files}
              onFilesAdded={onFilesAdded}
              onRemove={onRemoveFile}
              accept=".pdf,.doc,.docx,.xlsx,.zip"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-rust transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}