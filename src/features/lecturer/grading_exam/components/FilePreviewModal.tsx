import { FiDownload, FiFile } from 'react-icons/fi'
import Modal from '@/components/ui/modal'
import { toFileDisplayName, toFileUrl } from '@/utils/file'

interface FilePreviewData {
  label: string
  objectKey: string
}

interface FilePreviewModalProps {
  data: FilePreviewData | null
  onClose: () => void
}

/**
 * Không render nội dung file trong app nữa — chỉ hiển thị thông tin file
 * và nút tải về. Bỏ mammoth vì không cần xem trước .docx ngay trong UI.
 */
export default function FilePreviewModal({ data, onClose }: FilePreviewModalProps) {
  const fileName = data ? toFileDisplayName(data.objectKey) : ''
  const fileUrl = data ? toFileUrl(data.objectKey) : ''

  return (
    <Modal
      open={data !== null}
      onClose={onClose}
      title={data ? data.label : undefined}
      maxWidth="sm"
    >
      {data && (
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3 rounded-md border border-border-default px-4 py-3">
            <FiFile className="w-5 h-5 shrink-0 text-text-muted" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
              {fileName}
            </span>
          </div>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-rust transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            Tải file về
          </a>
        </div>
      )}
    </Modal>
  )
}