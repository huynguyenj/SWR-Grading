
import {
  FiCpu,
  FiDollarSign,
  FiKey,
  FiStar,
  FiEdit2,
  FiCheck,
  FiX,
  FiMousePointer,
  FiTrash2,
} from 'react-icons/fi'

import Input from '@/components/ui/input'
import Button from '@/components/ui/button'

import AiModelStatusBadge from './AiModelStatusBadge'
import AiModelEditFields from './AiModelEditFields'

import type { AiModel } from '../types/ai_model_type'

export interface EditFormValues {
  name: string
  apiKey: string
  price: string
}

interface AiModelTableRowProps {
  model: AiModel
  isEditing: boolean
  editValues: EditFormValues
  isUpdatingModel: boolean
  isUpdatingStatus: boolean
  isBusy: boolean
  onEdit: (model: AiModel) => void
  onCancelEdit: () => void
  onEditValueChange: (
    field: keyof EditFormValues,
    value: string,
  ) => void
  onSave: (model: AiModel) => void
  onSelect: (model: AiModel) => void
  onDelete: (model: AiModel) => void
}

export default function AiModelTableRow({
  model,
  isEditing,
  editValues,
  isUpdatingModel,
  isUpdatingStatus,
  isBusy,
  onEdit,
  onCancelEdit,
  onEditValueChange,
  onSave,
  onSelect,
  onDelete,
}: AiModelTableRowProps) {
  const price = Number(editValues.price)

  const canSave =
    editValues.name.trim().length > 0 &&
    editValues.apiKey.trim().length > 0 &&
    editValues.price.trim().length > 0 &&
    Number.isFinite(price) &&
    price >= 0

  return (
    <tr className="border-b border-border-default transition-colors last:border-b-0 hover:bg-bg-muted/40">
      {/* Model */}
      <td className="px-4 py-3">
        {isEditing ? (
          <AiModelEditFields
            name={editValues.name}
            disabled={isUpdatingModel}
            onChange={(value) => onEditValueChange('name', value)}
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
              <FiCpu size={17} />
            </div>

            <div className="min-w-0">
              <p className="font-medium text-text-primary">
                {model.name}
              </p>

              <p className="mt-0.5 text-xs text-text-secondary">
                ID: {model.modelId}
              </p>
            </div>
          </div>
        )}
      </td>

      {/* API Key */}
      <td className="px-4 py-3">
        {isEditing ? (
          <Input
            size="basic"
            type="password"
            value={editValues.apiKey}
            placeholder="Enter new API Key"
            disabled={isUpdatingModel}
            onChange={(event) =>
              onEditValueChange('apiKey', event.target.value)
            }
          />
        ) : model.hasApiKey ? (
          <div className="flex items-center gap-2 text-text-primary">
            <FiKey
              size={14}
              className="shrink-0 text-text-secondary"
            />

            <span className="font-mono text-xs">
              {model.apiKeyMasked}
            </span>
          </div>
        ) : (
          <span className="text-xs text-text-secondary">
            Not configured
          </span>
        )}
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        {isEditing ? (
          <Input
            size="basic"
            type="number"
            min="0"
            step="any"
            value={editValues.price}
            placeholder="Price"
            disabled={isUpdatingModel}
            onChange={(event) =>
              onEditValueChange('price', event.target.value)
            }
          />
        ) : (
          <div className="flex items-center gap-1.5 text-text-primary">
            <FiDollarSign
              size={14}
              className="text-text-secondary"
            />

            <span className="font-medium tabular-nums">
              {model.price.toLocaleString()}
            </span>
          </div>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <AiModelStatusBadge active={model.status} />
      </td>

      {/* Selection */}
      <td className="px-4 py-3">
        {model.isSelected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange">
            <FiStar size={13} />
            Selected
          </span>
        ) : (
          <span className="text-xs text-text-secondary">
            Not selected
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="default"
                size="basic"
                disabled={isUpdatingModel || !canSave}
                onClick={() => onSave(model)}
              >
                {isUpdatingModel ? (
                  'Saving...'
                ) : (
                  <>
                    <FiCheck size={15} />
                    <span className="ml-1">Save</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="basic"
                size="basic"
                disabled={isUpdatingModel}
                onClick={onCancelEdit}
              >
                <FiX size={15} />
                <span className="ml-1">Cancel</span>
              </Button>
            </>
          ) : (
            <>
              {/* Select */}
              <Button
                type="button"
                variant="basic"
                size="basic"
                disabled={
                  isBusy ||
                  model.isSelected ||
                  !model.hasApiKey
                }
                onClick={() => onSelect(model)}
              >
                {isUpdatingStatus ? (
                  'Selecting...'
                ) : (
                  <>
                    <FiMousePointer size={15} />
                    <span className="ml-1">Select</span>
                  </>
                )}
              </Button>

              {/* Edit */}
              <Button
                type="button"
                variant="basic"
                size="basic"
                disabled={isBusy}
                onClick={() => onEdit(model)}
              >
                <FiEdit2 size={15} />
                <span className="ml-1">Edit</span>
              </Button>

              {/* Delete */}
              <Button
                type="button"
                variant="danger"
                size="basic"
                disabled={isBusy}
                onClick={() => onDelete(model)}
              >
                <FiTrash2 size={15} />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
