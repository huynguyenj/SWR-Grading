import { useEffect } from 'react'
import { FiFileText } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import useGetFileDetail from '../hooks/useGetFileDetail'
import type { PaperSetFileType } from '../../examination_materials/types/exam_material.type'
import { FILE_TYPE_LABEL } from '../const/file_type'

interface PaperSetDocumentsModalProps {
  paperSetId: string | null
  onClose: () => void
  /** Các loại file cần hiển thị, theo đúng thứ tự truyền vào (1 = Câu hỏi, 2 = Rubric, 3 = Template) */
  fileTypes?: PaperSetFileType[]
  title?: string
}

const DEFAULT_FILE_TYPES: PaperSetFileType[] = [1, 2, 3]

export default function PaperSetDocumentsModal({
  paperSetId,
  onClose,
  fileTypes = DEFAULT_FILE_TYPES,
  title = 'Tài liệu bộ đề',
}: PaperSetDocumentsModalProps) {
  const { fileInformation, loading, handleGetFileInformation } = useGetFileDetail()

  useEffect(() => {
    if (paperSetId) {
      handleGetFileInformation(paperSetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperSetId])

  return (
    <Modal open={paperSetId !== null} onClose={onClose} title={title} maxWidth="lg">
      <div className="max-h-[75vh] overflow-y-auto px-5 py-4 space-y-5">
        {loading && (
          <p className="py-8 text-center text-sm text-text-muted">Đang tải tài liệu...</p>
        )}

        {!loading &&
          fileTypes.map((type) => {
            const file = fileInformation?.files.find((f) => f.fileType === type)
            return (
              <div key={type}>
                <div className="mb-1.5 flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-text-muted" />
                  <h3 className="text-sm font-semibold text-text-primary">
                    {FILE_TYPE_LABEL[type]}
                  </h3>
                  {file && <span className="text-xs text-text-muted">— {file.fileName}</span>}
                </div>
                <div className="rounded-md bg-bg-muted/50 p-4">
                  <p className="whitespace-pre-line text-sm text-text-primary leading-relaxed">
                    {file?.text || 'Chưa có nội dung.'}
                  </p>
                </div>
              </div>
            )
          })}
      </div>
    </Modal>
  )
}