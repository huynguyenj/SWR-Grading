
import { FiUpload, FiX, FiFileText } from 'react-icons/fi'

import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import type { SemesterType } from '../types/semester'
import useUploadStudentFile, {
  type UploadStudentFileType,
} from '../hooks/useUploadStudentFile'

interface UploadStudentFileModalProps {
  open: boolean
  onClose: () => void
  onRefresh: () => void
  semester?: SemesterType
}

export default function UploadStudentFileModal({
  onClose,
  onRefresh,
  open,
  semester,
}: UploadStudentFileModalProps) {
  const {
    handleSubmit,
    watch,
    errors,
    loading,
    onSubmit,
    setFile,
    reset,
  } = useUploadStudentFile({
    semesterId: semester?.semesterId ?? '',
    onRefresh,
  })

  const selectedFile = watch('File')

  const handleUpload = async (values: UploadStudentFileType) => {
    const success = await onSubmit(values)

    if (success) {
      onClose()
    }
  }

  const handleClose = () => {
    if (loading) return

    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Import danh sách sinh viên"
      maxWidth="lg"
    >
      <form
        onSubmit={handleSubmit(handleUpload)}
        className="space-y-5 px-5 py-4"
      >
        {/* Semester information */}
        <div className="rounded-lg border border-border-default bg-bg-muted/40 p-3">
          <p className="text-xs text-text-muted">
            Học kỳ
          </p>

          <p className="mt-1 font-medium text-text-primary">
            {semester?.name ?? 'Chưa chọn học kỳ'}
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            {semester?.semesterCode ?? ''}
          </p>
        </div>

        {/* File upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            File danh sách sinh viên
            <span className="ml-1 text-danger">*</span>
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-default bg-bg-muted/30 px-4 py-7 transition-colors hover:border-brand-orange">
            {selectedFile ? (
              <>
                <FiFileText className="h-7 w-7 text-brand-orange" />

                <span className="mt-2 text-sm font-medium text-text-primary">
                  {selectedFile.name}
                </span>

                <span className="mt-1 text-xs text-text-muted">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <FiUpload className="h-7 w-7 text-text-muted" />

                <span className="mt-2 text-sm font-medium text-text-secondary">
                  Nhấn để chọn file Excel
                </span>

                <span className="mt-1 text-xs text-text-muted">
                  Hỗ trợ định dạng .xlsx và .xls
                </span>
              </>
            )}

            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              disabled={loading}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null

                setFile(file)

                // Cho phép chọn lại cùng một file
                event.target.value = ''
              }}
            />
          </label>

          {errors.File && (
            <p className="mt-1.5 text-xs text-danger">
              {errors.File.message}
            </p>
          )}

          {selectedFile && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setFile(null)}
              className="mt-2 flex items-center gap-1 text-xs text-danger hover:underline disabled:opacity-50"
            >
              <FiX className="h-3.5 w-3.5" />
              Xóa file đã chọn
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-border-default pt-4">
          <Button
            type="button"
            variant="basic"
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            disabled={loading || !semester?.semesterId}
          >
            {loading ? 'Đang import...' : 'Import sinh viên'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
