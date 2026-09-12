import { useRef, useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi'

export interface ParsedSubmission {
  fileName: string
  fileSizeLabel: string
}

interface SubmissionUploadDropzoneProps {
  onFilesSelected: (files: ParsedSubmission[]) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Cho phép lecturer upload từng file bài làm (kéo-thả hoặc bấm chọn),
 * mỗi file tương ứng 1 bài nộp riêng biệt trong nhật ký chấm điểm.
 */
export default function SubmissionUploadDropzone({
  onFilesSelected,
}: SubmissionUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const parsed: ParsedSubmission[] = Array.from(fileList).map((file) => ({
      fileName: file.name,
      fileSizeLabel: formatSize(file.size),
    }))
    onFilesSelected(parsed)
  }

  return (
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
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
        dragActive
          ? 'border-brand-orange bg-brand-orange/5'
          : 'border-border-default hover:border-brand-orange/60 hover:bg-bg-muted/40',
      ].join(' ')}
    >
      <FiUploadCloud className="w-8 h-8 text-text-muted" />
      <p className="text-sm text-text-primary">
        Kéo thả file bài làm vào đây, hoặc{' '}
        <span className="font-medium text-brand-orange">bấm để chọn file</span>
      </p>
      <p className="text-xs text-text-muted">
        Có thể chọn nhiều file cùng lúc, mỗi file là 1 bài nộp riêng biệt
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  )
}