import { useRef, useState } from 'react'
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi'

interface DiarySubmissionUploadZoneProps {
  /** Trả về true nếu upload thành công — component tự xóa danh sách file đã chọn */
  onUpload: (files: File[]) => Promise<boolean>
  uploading: boolean
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DiarySubmissionUploadZone({
  onUpload,
  uploading,
}: DiarySubmissionUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setStagedFiles((prev) => [...prev, ...Array.from(fileList)])
  }

  function removeFile(index: number) {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleUploadClick() {
    if (stagedFiles.length === 0) return
    const success = await onUpload(stagedFiles)
    if (success) setStagedFiles([])
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
          addFiles(e.dataTransfer.files)
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
          Kéo thả file bài nộp vào đây, hoặc{' '}
          <span className="font-medium text-brand-orange">bấm để chọn file</span>
        </p>
        <p className="text-xs text-text-muted">Có thể chọn nhiều file cùng lúc</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {stagedFiles.length > 0 && (
        <>
          <ul className="space-y-1.5">
            {stagedFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-2.5 rounded-md border border-border-default px-3 py-2"
              >
                <FiFile className="w-4 h-4 shrink-0 text-text-muted" />
                <span className="flex-1 truncate text-sm text-text-primary">{file.name}</span>
                <span className="shrink-0 text-xs text-text-muted">{formatSize(file.size)}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="shrink-0 text-text-muted hover:text-danger transition-colors"
                  aria-label="Xóa file"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="w-full rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-brand-rust transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Đang tải lên...' : `Tải lên ${stagedFiles.length} file`}
          </button>
        </>
      )}
    </div>
  )
}