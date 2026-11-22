
import { FiUpload, FiX } from 'react-icons/fi'

import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import useCreateExamSession, { type CreateExamSessionType } from '../hooks/useCreaetExamSession'
import type { ExaminationType } from '@/features/admin/management/examination/types/examination.type'
import useGetExaminationDetail from '@/features/admin/management/examination/hooks/useGetExaminationDetail'

interface CreateExamSessionModalProps {
  examination: ExaminationType
  onClose: () => void
  onCreated: () => void
}

export default function CreateExaminationSessionModal({
  examination,
  onClose,
  onCreated,
}: CreateExamSessionModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setFile,
    errors,
    loading,
    onSubmit,
  } = useCreateExamSession({
    examinationId: examination.examinationId,
    onRefresh: onCreated,
  })
  const {
  examinationDetail,
  loading: detailLoading,
  } = useGetExaminationDetail({
  examinationId: examination.examinationId,
  })

const paperSets = examinationDetail?.paperSets ?? []
  const selectedFile = watch('File')

  const handleCreate = async (values: CreateExamSessionType) => {
    const success = await onSubmit(values)

    if (success) {
      onClose()
    }
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Tạo đợt thi"
      maxWidth="xl"
    >
      <form
        onSubmit={handleSubmit(handleCreate)}
        className="space-y-5 px-5 py-5"
      >
        {/* Examination information */}
        <div className="rounded-lg border border-border-default bg-bg-muted/40 p-3">
          <p className="text-xs text-text-muted">Kỳ thi</p>

          <p className="mt-1 font-medium text-text-primary">
            {examination.name}
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            {examination.examinationCode || 'Chưa có mã kỳ thi'}
          </p>
        </div>

        {/* Examination code */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Mã đợt thi <span className="text-danger">*</span>
          </label>

          <input
            type="text"
            {...register('ExaminationCode')}
            placeholder="Nhập mã đợt thi"
            className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange"
          />

          {errors.ExaminationCode && (
            <p className="mt-1 text-xs text-danger">
              {errors.ExaminationCode.message}
            </p>
          )}
        </div>

        {/* Date and time */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Ngày thi
            </label>

            <input
              type="date"
              {...register('StartDate')}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange"
            />

            {errors.StartDate && (
              <p className="mt-1 text-xs text-danger">
                {errors.StartDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Giờ thi
            </label>

            <input
              type="time"
              {...register('StartTime')}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange"
            />

            {errors.StartTime && (
              <p className="mt-1 text-xs text-danger">
                {errors.StartTime.message}
              </p>
            )}
          </div>
        </div>

        {/* Status and PaperSetId */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Đề thi <span className="text-danger">*</span>
            </label>

            <select
              {...register('PaperSetId')}
              disabled={detailLoading || paperSets.length === 0}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {detailLoading
                  ? 'Đang tải danh sách Paper Set...'
                  : paperSets.length === 0
                    ? 'Không có đề thi nào'
                    : 'Chọn đề thi'}
              </option>

              {paperSets.map((paperSet) => (
                <option
                  key={paperSet.paperSetId}
                  value={paperSet.paperSetId}
                >
                  {paperSet.paperSetCode} - {paperSet.totalQuestions} câu hỏi - {paperSet.lecturerName}
                </option>
              ))}
            </select>

            {errors.PaperSetId && (
              <p className="mt-1 text-xs text-danger">
                {errors.PaperSetId.message}
              </p>
            )}

            <p className="mt-1 text-xs text-text-muted">
              Chọn bộ đề được sử dụng cho đợt thi này.
            </p>
          </div>

        {/* File upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            File sinh viên <span className="text-danger">*</span>
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-default bg-bg-muted/30 px-4 py-6 transition-colors hover:border-brand-orange">
            {selectedFile ? (
              <>
                <FiUpload className="h-6 w-6 text-brand-orange" />
                <span className="mt-2 text-sm font-medium text-text-primary">
                  {selectedFile.name}
                </span>

                <span className="mt-1 text-xs text-text-muted">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <FiUpload className="h-6 w-6 text-text-muted" />

                <span className="mt-2 text-sm text-text-secondary">
                  Nhấn để chọn file
                </span>

                <span className="mt-1 text-xs text-text-muted">
                  Chọn file theo định dạng backend hỗ trợ
                </span>
              </>
            )}

            <input
              type="file"
              className="hidden"
              accept=".xlsx"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setFile(file)

                // Cho phép chọn lại cùng một file
                event.target.value = ''
              }}
            />
          </label>

          {errors.File && (
            <p className="mt-1 text-xs text-danger">
              {errors.File.message}
            </p>
          )}

          {selectedFile && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="mt-2 flex items-center gap-1 text-xs text-danger hover:underline"
            >
              <FiX className="h-3.5 w-3.5" />
              Xóa file đã chọn
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-border-default pt-4">
          <Button
            type="button"
            variant="basic"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo đợt thi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
