import { useRef, useState } from 'react'
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'

interface DiarySubmissionUploadZoneProps {
  /** Trả về true nếu upload thành công — component tự xóa file đã chọn */
  onUpload: (file: File) => Promise<boolean>
  uploading: boolean
}

export default function DiarySubmissionUploadZoneV2({
  onUpload,
  uploading,
}: DiarySubmissionUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [stagedFile, setStagedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(fileList: FileList | null) {
    const file = fileList?.[0]

    if (!file) return

    const fileName = file.name.toLowerCase()

    if (!fileName.endsWith('.rar') && !fileName.endsWith('.zip')) {
      toast.error('Vui lòng chọn file RAR hoặc ZIP.')
      return
    }

    setStagedFile(file)
  }

  async function handleUploadClick() {
    if (!stagedFile || uploading) return

    const success = await onUpload(stagedFile)

    if (success) {
      setStagedFile(null)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  function handleRemoveFile() {
    if (uploading) return

    setStagedFile(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => {
          if (!uploading) inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!uploading) setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)

          if (uploading) return

          handleFileChange(e.dataTransfer.files)
        }}
        className={[
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          uploading
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer',
          dragActive
            ? 'border-brand-orange bg-brand-orange/5'
            : 'border-border-default hover:border-brand-orange/60 hover:bg-bg-muted/40',
        ].join(' ')}
      >
        <FiUploadCloud className="h-8 w-8 text-text-muted" />

        <p className="text-sm text-text-primary">
          Kéo thả file bài nộp vào đây, hoặc{' '}
          <span className="font-medium text-brand-orange">
            bấm để chọn file
          </span>
        </p>

        <p className="text-xs text-text-muted">
          Chỉ chấp nhận một file RAR hoặc ZIP
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".rar,.zip,application/vnd.rar,application/x-rar-compressed,application/zip"
          onChange={(e) => {
            handleFileChange(e.target.files)

            // Cho phép chọn lại cùng một file.
            e.target.value = ''
          }}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {stagedFile && (
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 rounded-md border border-border-default px-3 py-2">
            <FiFile className="h-4 w-4 shrink-0 text-text-muted" />

            <span className="flex-1 truncate text-sm text-text-primary">
              {stagedFile.name}
            </span>

            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={uploading}
              className="shrink-0 text-text-muted transition-colors hover:text-danger disabled:opacity-50"
              aria-label="Xóa file"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleUploadClick}
            disabled={uploading}
            className="w-full rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-rust disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? 'Đang giải nén và tải lên...'
              : 'Upload file bài làm'}
          </button>
        </div>
      )}
    </div>
  )
}