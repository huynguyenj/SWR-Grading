
import { useEffect } from 'react'

import { FiCpu, FiKey, FiDollarSign, FiRefreshCw } from 'react-icons/fi'

import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'

import useCreateAiModel from '../hooks/useCreateAiModel'
import useGetSupportedAiModels from '../hooks/useGetSupportedAiModels'

interface CreateAiModelModalProps {
  open: boolean
  onClose: () => void
  onRefresh: () => void
}

export default function CreateAiModelModal({
  open,
  onClose,
  onRefresh,
}: CreateAiModelModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    loading: creating,
    reset,
    onSubmit,
    watch,
  } = useCreateAiModel({ onRefresh })

  const {
    data,
    supportedAiModels,
    loading: loadingModels,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    refresh: refreshSupportedModels,
  } = useGetSupportedAiModels({
    enabled: open,
    initialPage: 1,
    initialPageSize: 10,
  })

  const selectedModel = watch('name')

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  // Đóng modal và reset form
  const handleClose = () => {
    if (creating) return

    reset()
    onClose()
  }

  // Submit form
  const handleFormSubmit = async (
    formData: Parameters<typeof onSubmit>[0],
  ) => {
    const isSuccess = await onSubmit(formData)

    if (isSuccess) {
      reset()
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Tạo AI model mới"
      maxWidth="xl"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-4"
      >
        {/* Model information */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <FiCpu className="text-brand-orange" size={18} />

            <h3 className="text-sm font-semibold text-text-primary">
              Thông tin AI model
            </h3>
          </div>

          {/* Model name */}
          <div>
            <label
              htmlFor="aiModelName"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              Tên AI model
              <span className="ml-1 text-danger">*</span>
            </label>

            <select
              id="aiModelName"
              {...register('name')}
              disabled={creating || loadingModels}
              className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingModels
                  ? 'Đang tải danh sách model...'
                  : '-- Chọn AI model --'}
              </option>

              {/* 
                Giữ option đang chọn nếu model không nằm trong
                trang hiện tại sau khi chuyển trang.
              */}
              {selectedModel &&
                !supportedAiModels.includes(selectedModel) && (
                  <option value={selectedModel}>
                    {selectedModel}
                  </option>
                )}

              {supportedAiModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            {errors.name && (
              <p className="mt-1 text-xs text-danger">
                {errors.name.message}
              </p>
            )}

            {/* Supported model pagination */}
            {data && data.totalCount > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-text-secondary">
                    {data.totalCount} model được hỗ trợ
                  </p>

                  <button
                    type="button"
                    onClick={refreshSupportedModels}
                    disabled={loadingModels || creating}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-orange transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiRefreshCw
                      size={12}
                      className={loadingModels ? 'animate-spin' : ''}
                    />
                    Tải lại
                  </button>
                </div>

                {data.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={data.totalPages}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                  />
                )}
              </div>
            )}

            {!loadingModels &&
              supportedAiModels.length === 0 &&
              (!data || data.totalCount === 0) && (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-text-muted">
                    Không tìm thấy model được hỗ trợ.
                  </p>

                  <button
                    type="button"
                    onClick={refreshSupportedModels}
                    className="text-xs font-medium text-brand-orange hover:underline"
                    disabled={creating}
                  >
                    Tải lại
                  </button>
                </div>
              )}
          </div>

          {/* API Key */}
          <div>
            <label
              htmlFor="aiModelApiKey"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-primary"
            >
              <FiKey size={15} />
              API Key
              <span className="text-danger">*</span>
            </label>

            <Input
              id="aiModelApiKey"
              type="password"
              size="basic"
              placeholder="Nhập API Key của nhà cung cấp"
              disabled={creating}
              {...register('apiKey')}
            />

            {errors.apiKey && (
              <p className="mt-1 text-xs text-danger">
                {errors.apiKey.message}
              </p>
            )}

            <p className="mt-1 text-xs text-text-muted">
              API Key được sử dụng cho chức năng đánh giá bài làm bằng AI.
            </p>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="aiModelPrice"
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-primary"
            >
              <FiDollarSign size={15} />
              Giá
              <span className="text-danger">*</span>
            </label>

            <Input
              id="aiModelPrice"
              type="number"
              size="basic"
              min={0}
              step="any"
              placeholder="Nhập giá sử dụng model"
              disabled={creating}
              {...register('price')}
            />

            {errors.price && (
              <p className="mt-1 text-xs text-danger">
                {errors.price.message}
              </p>
            )}
          </div>
        </section>

        {/* Status */}
        {/* <section className="rounded-lg border border-border-default bg-bg-muted/40 p-3">
          <label
            htmlFor="aiModelStatus"
            className="flex cursor-pointer items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-medium text-text-primary">
                Trạng thái hoạt động
              </p>

              <p className="mt-0.5 text-xs text-text-secondary">
                Cho phép sử dụng AI model trong hệ thống.
              </p>
            </div>

            <input
              id="aiModelStatus"
              type="checkbox"
              {...register('status')}
              disabled={creating}
              className="h-4 w-4 shrink-0 accent-brand-orange"
            />
          </label>
        </section> */}

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border-default pt-4">
          <Button
            type="button"
            variant="basic"
            onClick={handleClose}
            disabled={creating}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="default"
            disabled={
              creating ||
              loadingModels ||
              supportedAiModels.length === 0
            }
          >
            {creating ? 'Đang tạo...' : 'Tạo AI model'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
