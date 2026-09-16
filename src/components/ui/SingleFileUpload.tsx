import { useRef } from 'react'
import { FiFile, FiUploadCloud, FiX } from 'react-icons/fi'

interface SingleFileUploadFieldProps {
  label: string
  file?: File | null
  onChange: (file: File | null) => void
  accept?: string
  error?: string
}

export default function SingleFileUploadField({
  label,
  file,
  onChange,
  accept,
  error,
}: SingleFileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>

      {file ? (
        <div className="flex items-center gap-2.5 rounded-md border border-border-default px-3 py-2.5">
          <FiFile className="w-4 h-4 shrink-0 text-text-muted" />
          <span className="flex-1 truncate text-sm text-text-primary">{file.name}</span>
          <button
            type="button"
            onClick={() => {
              onChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="shrink-0 text-text-muted hover:text-danger transition-colors"
            aria-label={`Xóa ${label}`}
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={[
            'flex w-full items-center gap-2.5 rounded-md border-2 border-dashed px-3 py-3 text-left transition-colors',
            error
              ? 'border-danger/50 hover:border-danger'
              : 'border-border-default hover:border-brand-orange/60 hover:bg-bg-muted/40',
          ].join(' ')}
        >
          <FiUploadCloud className="w-4 h-4 shrink-0 text-text-muted" />
          <span className="text-sm text-text-muted">Bấm để chọn file</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="hidden"
      />

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}