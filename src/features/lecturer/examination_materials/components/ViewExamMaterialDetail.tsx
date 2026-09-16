import { useState } from 'react'
import { FiCalendar } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import SemesterStatusBadge from '@/features/admin/management/semester/components/SemesterBadge'
import type { SemesterType } from '@/features/admin/management/semester/types/semester'
import { formatDate } from '@/utils/format'
import useGetExamMaterialBySemester from '../hooks/useGetExamMaterialBySemester'
import ExamMaterialCard from './ExamMaterialCard'
import FilePreviewModal from '../../grading_exam/components/FilePreviewModal'
import Button from '@/components/ui/button'

interface ViewExamMaterialDetailModalProps {
  semester: SemesterType | null
  onClose: () => void
  onOpen: boolean
}

export default function ViewExamMaterialDetailModal({
  onClose,
  semester,
  onOpen,
}: ViewExamMaterialDetailModalProps) {
  const { lecturerSemesterDetail, loading, onRefresh } = useGetExamMaterialBySemester({
    semesterId: semester?.semesterId ?? '',
  })
  
  const [previewFile, setPreviewFile] = useState<{ label: string; objectKey: string } | null>(
    null,
  )

  if (!semester) return null

  const examMaterials = lecturerSemesterDetail?.examMaterials ?? []

  return (
    <Modal open={onOpen} onClose={onClose} title={semester.name} maxWidth="lg">
      <div className="px-5 py-4 space-y-5">
        {/* Thông tin tóm tắt học kỳ — chỉ xem, không sửa được */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md bg-bg-muted/50 px-4 py-3 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
            {formatDate(semester.startDate)} – {formatDate(semester.endDate)}
          </span>
          <SemesterStatusBadge status={semester.status} />
        </div>

        {/* Danh sách đề thi (examMaterials) */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Danh sách đề thi</h3>

          {loading && (
            <p className="py-8 text-center text-sm text-text-muted">Đang tải danh sách...</p>
          )}

          {!loading && examMaterials.length === 0 && (
            <div className="rounded-md border border-border-default bg-bg-primary py-10 text-center">
              <p className="text-sm text-text-muted">Học kỳ này chưa có đề thi nào.</p>
            </div>
          )}

          {!loading && examMaterials.length > 0 && (
            <div className="max-h-[55vh] space-y-2.5 overflow-y-auto pr-1">
              {examMaterials.map((material) => (
                <ExamMaterialCard
                  key={material.examMaterialId}
                  material={material}
                  // onFileClick={(label, objectKey) => setPreviewFile({ label, objectKey })}
                  onRefresh={onRefresh}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <Button
            onClick={onClose}
          >
            Xong
          </Button>
        </div>
      </div>

      <FilePreviewModal data={previewFile} onClose={() => setPreviewFile(null)} />
    </Modal>
  )
}