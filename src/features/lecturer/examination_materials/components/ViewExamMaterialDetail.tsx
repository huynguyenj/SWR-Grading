import type { UploadedFile } from "@/components/ui/FileUploadZone"
import Modal from "@/components/ui/modal"
import SemesterStatusBadge from "@/features/admin/management/semester/components/SemesterBadge"
import type { Semester } from "@/features/admin/management/semester/types/semester"
import { formatDate } from "@/utils/format"
import { FiCalendar } from "react-icons/fi"

interface ViewExamMaterialDetailModalModalProps {
  semester: Semester | null
  onClose: () => void
  onOpen: boolean
  files: UploadedFile[]
  onFilesAdded?: (files: UploadedFile[]) => void
  onRemoveFile?: (id: string) => void
}
export default function ViewExamMaterialDetailModal({  onClose, semester, onOpen }: ViewExamMaterialDetailModalModalProps) {
  return (
    <Modal open={onOpen} onClose={onClose} title={semester?.name} maxWidth="lg">
      {semester && (
        <div className="px-5 py-4 space-y-5">
          {/* Thông tin tóm tắt học kỳ — chỉ xem, không sửa được */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md bg-bg-muted/50 px-4 py-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
              {formatDate(semester.startDate)} – {formatDate(semester.endDate)}
            </span>
            <SemesterStatusBadge status={semester.status} />
          </div>
          {/* Upload tài liệu */}
          {/* <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">
              Tài liệu học kỳ
            </h3>
            <FileUploadDropzone
              files={files}
              onFilesAdded={onFilesAdded}
              onRemove={onRemoveFile}
              accept=".pdf,.doc,.docx,.xlsx,.zip"
            />
          </div> */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Danh sách đề thi</h3>
            <div className="bg-bg-muted/50 px-3 py-2">
              <div className="max-h-[60vh] overflow-y-auto">
                <p className="text-sm">[01] Tiêu đề: bài thi SWR308x - Đề thi: SWR308x_FA26xxx.zip</p>
              </div>
            </div>
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
