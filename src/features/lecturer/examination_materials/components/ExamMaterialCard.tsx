import { FiDownload, FiFile, FiHelpCircle, FiTrash } from 'react-icons/fi'
import { toFileDisplayName } from '@/utils/file'
import { useState } from 'react'
import Button from '@/components/ui/button'
import useDownloadExamFiles from '../hooks/useDownloadExamFiles'
import type { PaperSetType } from '../types/exam_material.type'
import PaperSetStatusBadge from './PaperSetStatusBadge'
import useDeletePaperSet from '../hooks/useDeletePaperSet'
import DeletePaperSetModal from './DeletePaperSetModal'

interface PaperSetCardProps {
  material: PaperSetType
  // onFileClick: (label: string, objectKey: string) => void
  onRefresh: () => void
}

interface FileChipProps {
  label: string
  objectKey: string
  // onClick: () => void
}

function FileChip({ label, objectKey }: FileChipProps) {
  if (!objectKey) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border-default px-2.5 py-1.5 text-xs text-text-muted opacity-60">
        <FiFile className="w-3.5 h-3.5" />
        {label}: chưa có file
      </span>
    )
  }

  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-md border border-border-default px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-orange hover:text-brand-orange"
      title={toFileDisplayName(objectKey)}
    >
      <FiFile className="w-3.5 h-3.5 shrink-0" />
      <span className="max-w-40 truncate">{label}</span>
    </button>
  )
}

export default function PaperSetCard({ material, onRefresh }: PaperSetCardProps) {
  const { loading, onDelete } = useDeletePaperSet({ selectedPaperSetId: material.paperSetId, onRefresh: onRefresh })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { handleDownloadFiles } = useDownloadExamFiles({ examMaterialId: material.paperSetId, examMaterialCode: material.paperSetCode })
  const handleOpenDeleteModal = () => {
      setIsDeleteModalOpen(prev => !prev)
  }
  return (
    <div className="rounded-md border border-border-default p-3 space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-4">
          <p className="text-xs font-medium text-text-muted">Mã đề: {material.paperSetCode}</p>
          <p className="text-sm font-medium text-text-primary">{material.description}</p>
        </div>
        <PaperSetStatusBadge status={material.status} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <FiHelpCircle className="w-3.5 h-3.5" />
        {material.totalQuestions} câu hỏi
      </div>
      <div className='flex items-center justify-between'>
            <div className="flex flex-wrap gap-2">
            <FileChip
                  label="Đề thi"
                  objectKey={material.fileQuestionDocs}
            />
            <FileChip
                  label="Rubric"
                  objectKey={material.fileAnswerRubric}
            />
            <FileChip
                  label="Đáp án"
                  objectKey={material.fileAnswerTemplate}
            />
            </div>
            <div className='flex items-center gap-2'>

              <Button
                    size='basic'
                    variant='danger'
                    onClick={handleOpenDeleteModal}
                    >
                    <FiTrash/>
              </Button>
            </div>
      </div>
      <Button
          size='basic'
          onClick={handleDownloadFiles}
      >
        <FiDownload/>
        Tải file về
      </Button>
      <DeletePaperSetModal
                  loading={loading}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onDelete={onDelete}
                  open={isDeleteModalOpen}
      />
    </div>
  )
}