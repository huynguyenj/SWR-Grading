
import { useState } from 'react'
import { FiCpu } from 'react-icons/fi'
import { toast } from 'react-toastify'

import useUpdateAiModelStatus from '../hooks/useUpdateAiModelStatus'
import useUpdateAiModel from '../hooks/useUpdateAiModel'
import useDeleteAiModel from '../hooks/useDeleteAiModel'

import AiModelTableRow from './AiModelTableRow'
import AIModelConfirmDelete from './AIModelConfirmDelete'

import type { AiModel, UpdateAiModelPayload } from '../types/ai_model_type'
import type { EditFormValues } from './AiModelTableRow'
import Loading_Circle from '@/components/ui/loading_circle'

interface AiModelTableProps {
  items: AiModel[]
  loading: boolean
  onRefresh: () => void
}

const INITIAL_EDIT_VALUES: EditFormValues = {
  name: '',
  apiKey: '',
  price: '0',
}

export default function AiModelTable({
  items,
  loading,
  onRefresh,
}: AiModelTableProps) {
  const { updateStatus } = useUpdateAiModelStatus()
  const { updateAiModel } = useUpdateAiModel()

  const { deleteLoading, handleDeleteAiModel } = useDeleteAiModel()

  const [editingModelId, setEditingModelId] = useState<string | null>(null)
  const [editValues, setEditValues] =
    useState<EditFormValues>(INITIAL_EDIT_VALUES)

  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(
    null,
  )
  const [updatingModelId, setUpdatingModelId] = useState<string | null>(null)

  // Model đang được yêu cầu xóa.
  const [deletingModel, setDeletingModel] = useState<AiModel | null>(null)

  const isBusy = Boolean(
    updatingStatusId || updatingModelId || deleteLoading,
  )

  // Bắt đầu chỉnh sửa model.
  const handleEdit = (model: AiModel) => {
    setEditingModelId(model.modelId)

    setEditValues({
      name: model.name,
      apiKey: '',
      price: String(model.price),
    })
  }

  // Hủy chỉnh sửa.
  const handleCancelEdit = () => {
    setEditingModelId(null)
    setEditValues(INITIAL_EDIT_VALUES)
  }

  // Cập nhật giá trị form.
  const handleEditValueChange = (
    field: keyof EditFormValues,
    value: string,
  ) => {
    setEditValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  // Chọn model sử dụng cho hệ thống.
  const handleSelectModel = async (model: AiModel) => {
    if (updatingStatusId || updatingModelId || deleteLoading) return

    try {
      setUpdatingStatusId(model.modelId)

      const success = await updateStatus(model.modelId, true)

      if (success) {
        onRefresh()
        toast.success('Chọn AI model thành công')
      }
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Lưu thông tin model sau khi chỉnh sửa.
  const handleSaveEdit = async (model: AiModel) => {
    const name = editValues.name.trim()
    const apiKey = editValues.apiKey.trim()
    const price = Number(editValues.price)

    if (!name || !apiKey || !editValues.price.trim()) return
    if (!Number.isFinite(price) || price < 0) return

    const payload: UpdateAiModelPayload = {
      name,
      apiKey,
      price,
    }

    try {
      setUpdatingModelId(model.modelId)

      const success = await updateAiModel(model.modelId, payload)

      if (success) {
        handleCancelEdit()
        onRefresh()
      }
    } finally {
      setUpdatingModelId(null)
    }
  }

  // Mở modal xác nhận xóa.
  const handleDeleteClick = (model: AiModel) => {
    if (isBusy || editingModelId) return

    setDeletingModel(model)
  }

  // Đóng modal xác nhận.
  const handleCloseDelete = () => {
    if (deleteLoading) return

    setDeletingModel(null)
  }

  // Xác nhận xóa model.
  const handleConfirmDelete = async () => {
    if (!deletingModel || deleteLoading) return

    const success = await handleDeleteAiModel(deletingModel.modelId)

    if (success) {
      setDeletingModel(null)
      onRefresh()
    }
  }

  // Loading state.
  if (loading && items.length === 0) {
    return <Loading_Circle/>
  }

  // Empty state.
  if (items.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-border-default bg-bg-primary px-4 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg-surface text-text-secondary">
          <FiCpu size={22} />
        </div>

        <h3 className="font-medium text-text-primary">
          No AI models found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          There are currently no AI models to display. Create a model
          to get started.
        </p>
      </div>
    )
  }

  return (
    <>
      <div
        className={`overflow-x-auto rounded-lg border border-border-default bg-bg-primary ${
          loading ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-bg-muted/50 text-xs uppercase text-text-secondary">
            <tr>
              <th className="px-4 py-3 font-semibold">Model</th>
              <th className="px-4 py-3 font-semibold">API Key</th>
              <th className="px-4 py-3 font-semibold">Chi phí</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold">Lựa chọn</th>
              <th className="px-4 py-3 text-center font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((model) => (
              <AiModelTableRow
                key={model.modelId}
                model={model}
                isEditing={editingModelId === model.modelId}
                editValues={editValues}
                isUpdatingModel={updatingModelId === model.modelId}
                isUpdatingStatus={updatingStatusId === model.modelId}
                isBusy={isBusy}
                onEdit={handleEdit}
                onCancelEdit={handleCancelEdit}
                onEditValueChange={handleEditValueChange}
                onSave={handleSaveEdit}
                onSelect={handleSelectModel}
                onDelete={handleDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <AIModelConfirmDelete
        open={Boolean(deletingModel)}
        modelName={deletingModel?.name ?? ''}
        loading={deleteLoading}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
