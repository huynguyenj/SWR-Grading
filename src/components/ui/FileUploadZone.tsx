import { useRef, useState } from 'react'
import { FiUploadCloud, FiFile, FiTrash2 } from 'react-icons/fi'

export interface UploadedFile {
  id: string
  name: string
  sizeLabel: string
}

interface FileUploadDropzoneProps {
  files: UploadedFile[]
  onFilesAdded: (files: UploadedFile[]) => void
  onRemove: (id: string) => void
  /** VD: ".pdf,.doc,.docx" — để trống nếu nhận mọi loại file */
  accept?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Dropzone upload file dùng chung cho toàn dự án.
 * Chỉ xử lý UI: kéo-thả, chọn file, hiển thị danh sách + xóa.
 * KHÔNG gọi API upload thật — nơi dùng tự nối logic upload vào onFilesAdded.
 */
export default function FileUploadDropzone({
  files,
  onFilesAdded,
  onRemove,
  accept,
}: FileUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const mapped: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      sizeLabel: formatSize(f.size),
    }))
    onFilesAdded(mapped)
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          dragActive
            ? 'border-brand-orange bg-brand-orange/5'
            : 'border-border-default hover:border-brand-orange/60 hover:bg-bg-muted/40',
        ].join(' ')}
      >
        <FiUploadCloud className="w-8 h-8 text-text-muted" />
        <p className="text-sm text-text-primary">
          Kéo thả file vào đây, hoặc{' '}
          <span className="font-medium text-brand-orange">bấm để chọn file</span>
        </p>
        <p className="text-xs text-text-muted">
          {accept ? `Định dạng hỗ trợ: ${accept}` : 'Hỗ trợ mọi định dạng file'}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-2.5 rounded-md border border-border-default px-3 py-2"
            >
              <FiFile className="w-4 h-4 shrink-0 text-text-muted" />
              <span className="flex-1 truncate text-sm text-text-primary">{file.name}</span>
              <span className="shrink-0 text-xs text-text-muted">{file.sizeLabel}</span>
              <button
                onClick={() => onRemove(file.id)}
                className="shrink-0 text-text-muted hover:text-danger transition-colors"
                aria-label="Xóa file"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}